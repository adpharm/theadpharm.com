import { db } from "@/db";
import { tableUsers } from "@/db/schema";
import {
  hashPassword,
  ipPasswordHashRateLimit,
  verifyPasswordStrength,
} from "@/lib/server/password";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/lib/server/session";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq } from "drizzle-orm";

/**
 *
 * For registering a new user
 *
 */
export const signUpAction = defineAction({
  input: z.object({
    email: z.string().email(),
    username: z.string(),
    password: z.string().min(6),
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
    // if (
    //   clientIP !== null &&
    //   ipSendSignUpVerificationEmailRateLimit.check(clientIP, 1)
    // ) {
    //   return new Response("Too many requests", {
    //     status: 429,
    //   });
    // }

    const { email: _email, username, password } = inputData;
    const email = _email.toLowerCase().trim();

    // const emailAvailable = await isEmailAvailable(email);
    const usernameAvailable = await isUsernameAvailable(username);

    if (!usernameAvailable) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Username is already taken",
      });
    }

    const strongPassword = await verifyPasswordStrength(password);

    if (!strongPassword) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Password is too weak",
      });
    }

    if (clientIP !== null && !ipPasswordHashRateLimit.consume(clientIP, 1)) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }

    // if (
    //   clientIP !== null &&
    //   ipSendSignUpVerificationEmailRateLimit.consume(clientIP, 1)
    // ) {
    //   throw new ActionError({
    //     code: "TOO_MANY_REQUESTS",
    //     message: "Too many requests",
    //   });
    // }

    // create the user
    const passwordHash = await hashPassword(password);
    const users = await db
      .insert(tableUsers)
      .values({
        email,
        username,
        password_hash: passwordHash,
      })
      .returning();

    if (users.length === 0) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
      });
    }

    const user = users[0];

    // log the user in
    const sessionToken = await generateSessionToken();

    // const session = await createSignUpSession(
    //   sessionToken,
    //   email,
    //   username,
    //   password,
    // );
    // sendVerificationEmail(session.email, session.emailVerificationCode);

    // setSignUpSessionTokenCookie(context, sessionToken, session.expiresAt);

    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(context, sessionToken, session.expires_at);

    const { password_hash, ...userWithoutPasswordHash } = user;

    return {
      user: userWithoutPasswordHash,
    };
  },
});

/**
 *
 * Create an anonymous user and log them in
 *
 */
export const signUpAndSignInAnonUser = defineAction({
  input: z.object({
    email: z.string().email(),
    username: z.string().optional(),
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

    const { email: _email, username: _username } = inputData;
    const email = _email.toLowerCase().trim();

    if (clientIP !== null && !ipPasswordHashRateLimit.consume(clientIP, 1)) {
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many requests",
      });
    }

    // create the user
    const passwordHash = await hashPassword("WelcomeAll1!!");

    const randomSix = Math.floor(100000 + Math.random() * 900000);
    const username = _username ?? `guest_${randomSix}`;

    const users = await db
      .insert(tableUsers)
      .values({
        email,
        username,
        password_hash: passwordHash,
      })
      .returning();

    if (users.length === 0) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to create user",
      });
    }

    const user = users[0];

    // log the user in
    const sessionToken = await generateSessionToken();

    const session = await createSession(sessionToken, user.id);
    await setSessionTokenCookie(context, sessionToken, session.expires_at);

    const { password_hash, ...userWithoutPasswordHash } = user;

    return {
      user: userWithoutPasswordHash,
    };
  },
});

async function isEmailAvailable(email: string): Promise<boolean> {
  const users = await db
    .select()
    .from(tableUsers)
    .where(eq(tableUsers.email, email));

  return users.length === 0;
}

async function isUsernameAvailable(username: string): Promise<boolean> {
  const users = await db
    .select()
    .from(tableUsers)
    .where(eq(tableUsers.username, username));

  return users.length === 0;
}
