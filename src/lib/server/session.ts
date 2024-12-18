import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { ActionAPIContext } from "astro:actions";
import { db } from "@/db";
import { tableSessions, tableUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Validate a session token
 *
 * @param token
 * @returns
 */
export async function validateSessionToken(token: string): Promise<
  | {
      session: typeof tableSessions.$inferSelect;
      user: typeof tableUsers.$inferSelect;
    }
  | { session: null; user: null }
> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const sessionsWithUsers = await db
    .select()
    .from(tableSessions)
    .where(eq(tableSessions.id, sessionId))
    .innerJoin(tableUsers, eq(tableSessions.user_id, tableUsers.id));

  if (sessionsWithUsers.length === 0) {
    return { session: null, user: null };
  }

  const session = sessionsWithUsers[0].session;
  const user = sessionsWithUsers[0].user;

  // Delete the session if it has expired
  if (Date.now() >= session.expires_at.getTime()) {
    await db.delete(tableSessions).where(eq(tableSessions.id, session.id));
    return { session: null, user: null };
  }

  // Update the session expiration date if it is within 15 days of expiring
  if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
    // session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    // db.execute("UPDATE session SET expires_at = ? WHERE session.id = ?", [
    //   Math.floor(session.expiresAt.getTime() / 1000),
    //   session.id,
    // ]);

    // newExpiresAt is 30 days from now
    const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(tableSessions)
      .set({ expires_at: newExpiresAt })
      .where(eq(tableSessions.id, session.id));
  }

  return { session, user };
}

/**
 * Invalidate a session
 *
 * @param sessionId
 */
export async function invalidateSession(sessionId: string) {
  await db.delete(tableSessions).where(eq(tableSessions.id, sessionId));
}

/**
 * Invalidate all sessions for a user
 *
 * @param userUuid
 */
export async function invalidateUserSessions(userId: number) {
  await db.delete(tableSessions).where(eq(tableSessions.user_id, userId));
}

export function setSessionTokenCookie(
  context: ActionAPIContext,
  token: string,
  expiresAt: Date,
): void {
  context.cookies.set("session", token, {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    expires: expiresAt,
  });
}

export function deleteSessionTokenCookie(context: ActionAPIContext): void {
  context.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    secure: import.meta.env.PROD,
    sameSite: "lax",
    maxAge: 0,
  });
}

export function generateSessionToken(): string {
  const tokenBytes = new Uint8Array(20);
  crypto.getRandomValues(tokenBytes);
  const token = encodeBase32LowerCaseNoPadding(tokenBytes).toLowerCase();
  return token;
}

/**
 * Create a session
 *
 * @param token
 * @param userUuid
 * @returns
 */
export async function createSession(
  token: string,
  userId: number,
  // flags: SessionFlags,
): Promise<typeof tableSessions.$inferSelect> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: typeof tableSessions.$inferInsert = {
    id: sessionId,
    user_id: userId,
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    // twoFactorVerified: flags.twoFactorVerified,
  };

  const insertedSession = await db
    .insert(tableSessions)
    .values(session)
    .returning();

  if (insertedSession.length === 0) {
    throw new Error("Failed to create session");
  }

  return insertedSession[0];
}

// export function setSessionAs2FAVerified(sessionId: string): void {
//   db.execute("UPDATE session SET two_factor_verified = 1 WHERE id = ?", [
//     sessionId,
//   ]);
// }

// export interface SessionFlags {
// 	twoFactorVerified: boolean;
// }
