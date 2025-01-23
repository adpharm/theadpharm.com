import type { christmas21QuestionsUsers, tableUsers } from "@/db/schema";
import type { AstroGlobal } from "astro";
import { ActionError, type ActionAPIContext } from "astro:actions";

export function requireUserForAction(
  context: ActionAPIContext,
): typeof tableUsers.$inferSelect {
  if (context.locals.session === null || context.locals.user === null) {
    // throw new Error("Not logged in but auth required");
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "Not logged in but auth required",
    });
  }

  return context.locals.user;
}

export function getUser(
  context: AstroGlobal,
): typeof tableUsers.$inferSelect | null {
  if (context.locals.session === null || context.locals.user === null) {
    return null;
  }

  return context.locals.user;
}

export function getUserFor21Questions(
  context: AstroGlobal,
): typeof christmas21QuestionsUsers.$inferSelect | null {
  if (context.locals.session === null || context.locals.user === null) {
    return null;
  }

  return {
    id: context.locals.user.id,
    username: context.locals.user.username,
    password_hash: context.locals.user.password_hash,
    numberOfGamesPlayed: 0, 
  };
}

/**
 *
 * TODO:
 * We want to provide the lowest barrier to entry for users to play games.
 * so we allow guest accounts to play (no email required)
 * but we want to restrict guest accounts to 1 game, unless they have the email code, in which case they can play more games.
 *
 */
