import { z } from "astro:schema";
import { ActionError, type ActionAPIContext } from "astro:actions";
import {
  checkIpHashRateLimit,
  consumeIpHashRateLimit,
  createStrongRandomPassword,
  hashPassword,
  verifyPasswordHash,
  verifyPasswordStrength,
} from "@/lib/server/actions.password";
import { db } from "@/db";
import { tableUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "./session";
import { BasicRateLimit } from "./actions.rateLimit";
import { createGuestUserSchema, signInUserSchema } from "../zod.schema";

/**
 *
 *
 *
 * Create a new user.
 *
 *
 *
 *
 * @param inputData
 * @param context
 * @returns
 */
export async function createUser(
  inputData: z.infer<typeof createGuestUserSchema>, // important: using the guest schema
  context: ActionAPIContext,
) {
  // check if the IP is rate limited
  checkIpHashRateLimit(context);

  const { email: _email, username, password: _password } = inputData;
  const email = _email?.toLowerCase()?.trim();

  // const emailAvailable = await isEmailAvailable(email);
  const usernameAvailable = await isUsernameAvailable(username);

  if (!usernameAvailable) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Username is already taken. Please choose another one.",
    });
  }

  // either use the given password or create a strong random password
  const password = _password || (await createStrongRandomPassword());
  const strongPassword = await verifyPasswordStrength(password);

  if (!strongPassword) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Password is too weak",
    });
  }

  consumeIpHashRateLimit(context);

  // hash the password
  const passwordHash = await hashPassword(password);

  // build insert object
  const userDataToInsert: typeof tableUsers.$inferInsert = {
    ...inputData,
    username,
    password_hash: passwordHash,
  };

  if (email) userDataToInsert.email = email;

  // create the user
  const users = await db
    .insert(tableUsers)
    .values(userDataToInsert)
    .returning();

  if (users.length === 0) {
    throw new ActionError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Failed to create user",
    });
  }

  const user = users[0];

  return user;
}

/**
 *
 *
 * Start a user session
 *
 *
 *
 * @param user
 * @param context
 * @returns
 */
export async function startUserSession(
  user: typeof tableUsers.$inferSelect,
  context: ActionAPIContext,
) {
  // log the user in
  const sessionToken = await generateSessionToken();
  const session = await createSession(sessionToken, user.id);
  await setSessionTokenCookie(context, sessionToken, session.expires_at);

  const { password_hash, ...userWithoutPasswordHash } = user;

  return {
    user: userWithoutPasswordHash,
  };
}

/**
 *
 *
 *
 *
 * Sign in a user
 *
 */

export async function signInUser(
  inputData: z.infer<typeof signInUserSchema>,
  context: ActionAPIContext,
) {
  // check if the IP is rate limited
  checkIpHashRateLimit(context);

  const { username, password } = inputData;

  const users = await db
    .select()
    .from(tableUsers)
    .where(eq(tableUsers.username, username));

  if (users.length === 0) {
    throw new ActionError({
      code: "BAD_REQUEST",
      message: "Invalid credentials",
    });
  }

  const user = users[0];

  // consume ip rate limit
  consumeIpHashRateLimit(context);

  // consume user login rate limit
  if (!userLoginRateLimit.consume(user.id, 1)) {
    throw new ActionError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests for this user",
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

  // create a session
  return await startUserSession(user, context);
}

/**
 *
 *
 *
 *
 * Utils
 *
 *
 *
 *
 */

// async function isEmailAvailable(email: string): Promise<boolean> {
//   const users = await db
//     .select()
//     .from(tableUsers)
//     .where(eq(tableUsers.email, email));

//   return users.length === 0;
// }

async function isUsernameAvailable(username: string): Promise<boolean> {
  const users = await db
    .select()
    .from(tableUsers)
    .where(eq(tableUsers.username, username));

  return users.length === 0;
}

/**
 * For Astro.locals.user
 */
export type User = typeof tableUsers.$inferSelect;

/**
 * Rate limit for user login
 */
export const userLoginRateLimit = new BasicRateLimit<number>(10, 60 * 10);