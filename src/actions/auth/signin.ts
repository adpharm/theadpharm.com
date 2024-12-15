import { db } from "@/db";
import { tableUsers } from "@/db/schema";
import {
  hashPassword,
  ipPasswordHashRateLimit,
  verifyPasswordHash,
  verifyPasswordStrength,
} from "@/lib/server/password";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { getUserFromEmail, userLoginRateLimit } from "@/lib/server/user";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";

export const signInAction = defineAction({
  input: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
  handler: async (inputData, context) => {
    // TODO: Assumes X-Forwarded-For is always included.
    const clientIP = context.request.headers.get("X-Forwarded-For");
    if (clientIP !== null && !ipPasswordHashRateLimit.check(clientIP, 1)) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }

    const { email: _email, password } = inputData;
    const email = _email.toLowerCase().trim();

    const user = await getUserFromEmail(email);

    if (user === null) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid credentials",
      });
    }

    if (clientIP !== null && !ipPasswordHashRateLimit.consume(clientIP, 1)) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }

    if (!userLoginRateLimit.consume(user.id, 1)) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }

    const { password_hash, ...userWithoutPassword } = user;

    const validPassword = await verifyPasswordHash(password_hash, password);

    if (!validPassword) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid credentials",
      });
    }

    userLoginRateLimit.reset(user.id);
    // const sessionFlags: SessionFlags = {
    //   twoFactorVerified: false,
    // };
    const sessionToken = await generateSessionToken();
    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(context, sessionToken, session.expires_at);

    return {
      user: userWithoutPassword,
    };
  },
});
