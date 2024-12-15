import {
  deleteSessionTokenCookie,
  invalidateSession,
} from "@/lib/server/session";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";

/**
 *
 * For registering a new user
 *
 */
export const signOutAction = defineAction({
  input: undefined,
  handler: async (inputData, context) => {
    if (context.locals.session === null) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Not logged in",
      });
    }

    await invalidateSession(context.locals.session.id);
    await deleteSessionTokenCookie(context);

    return {};
  },
});
