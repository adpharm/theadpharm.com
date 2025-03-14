import { signInUser, startUserSession } from "@/lib/server/actions.user";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { createUser } from "@/lib/server/actions.user";
import {
  deleteSessionTokenCookie,
  invalidateSession,
} from "@/lib/server/session";
import {
  createFullUserSchema,
  createGuestUserSchema,
  createGuestUser21QuestionsSchema,
  signInUserSchema,
} from "@/lib/zod.schema";

export const user = {
  /**
   * For registering a new user
   */
  createFullUserAndSignIn: defineAction({
    input: createFullUserSchema, // important: using the full user schema
    handler: async (inputData, context) => {
      // create the user
      const user = await createUser(inputData, context);

      // log the user in
      await startUserSession(user, context);
    },
  }),

  /**
   * For registering a new user (guest)
   */
  createGuestUserAndSignIn: defineAction({
    input: createGuestUserSchema, // important: using the guest schema
    handler: async (inputData, context) => {
      // create the user
      const user = await createUser(inputData, context);

      // log the user in
      await startUserSession(user, context);
    },
  }),

  /**
   * For registering a new user (guest) for 21 questions game only
   */
  createGuestUserAndSignIn21Questions: defineAction({
    input: createGuestUser21QuestionsSchema, // important: using the guest schema
    handler: async (inputData, context) => {
      // create the user
      const christmas21QuestionsUsers = await createUser(
        inputData,
        context,
      );

      // log the user in
      await startUserSession(christmas21QuestionsUsers, context);
    },
  }),

  /**
   * For signing out a user
   */
  signoutUser: defineAction({
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
  }),

  /**
   * For signing in a user
   */
  signInUser: defineAction({
    input: signInUserSchema,
    handler: async (inputData, context) => await signInUser(inputData, context),
  }),
};
