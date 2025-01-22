import { requireUserForAction } from "@/lib/server/auth.utils";

import { db } from "@/db";
import {
  christmas21QuestionsGames,
  christmas21QuestionsUsers,
} from "@/db/schema";
import { ActionError, defineAction } from "astro:actions";
import { eq, sql } from "drizzle-orm";
import type { APIContext } from "astro";
import { logDebug, logInfo } from "@/lib/utils.logger";

export const christmas21Questions = {
  /*****************************************************************************************************************************
   *
   *
   * For creating a new 21 questions game
   *
   *
   ****************************************************************************************************************************/
  newGame: defineAction({
    input: undefined,
    handler: async (inputData, context) => {
      try {
        const user = requireUserForAction(context);
        const { canPlay, gamesRemaining } = await canUserPlay(user.id);

        if (!canPlay) {
          throw new ActionError({
            code: "TOO_MANY_REQUESTS",
            message: `Maximum number of games reached. Games remaining: ${gamesRemaining}`,
          });
        }

        // Create new game first
        const [game] = await db
          .insert(christmas21QuestionsGames)
          .values({
            userId: user.id,
            createdAt: new Date(),
            gameOver: false,
          })
          .returning();

        // Then increment games played

        // I was getting this error: https://community.neon.tech/t/how-do-i-handle-transactions/1067
        // NeonDB HTTP driver doesn't support transactions this way. We need to create the operations sequentially -- https://community.neon.tech/t/how-do-i-handle-transactions/1067
        const [updated] = await db
          .update(christmas21QuestionsUsers)
          .set({
            numberOfGamesPlayed: sql`${christmas21QuestionsUsers.numberOfGamesPlayed} + 1`,
          })
          .where(eq(christmas21QuestionsUsers.id, user.id))
          .returning();

        return {
          success: true,
          game: game,
          meta: {
            gamesRemaining: gamesRemaining - 1,
            gamesPlayed: updated.numberOfGamesPlayed,
          },
        };
      } catch (error) {
        logDebug("Error during new 21 Questions game creation", error);
        throw error;
      }
    },
  }),
  checkGamesRemaining: defineAction({
    input: undefined,
    handler: async (input, context) => {
      const user = input.userId
        ? { id: input.userId }
        : requireUserForAction(context);
      const result = await canUserPlay(user.id);
      return {
        success: true,
        data: result,
      };
    },
  }),
  incrementGamesPlayed: defineAction({
    input: undefined,
    handler: async (input, context) => {
      const user = input.userId
        ? { id: input.userId }
        : requireUserForAction(context);

      const updated = await incrementGamesPlayed(user.id);

      return {
        success: true,
        data: updated,
      };
    },
  }),
};

export const canUserPlay = async (userId: number) => {
  const MAX_GAMES = 10;

  const [user] = await db
    .select()
    .from(christmas21QuestionsUsers)
    .where(eq(christmas21QuestionsUsers.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    canPlay: user.numberOfGamesPlayed < MAX_GAMES,
    gamesRemaining: MAX_GAMES - user.numberOfGamesPlayed,
    gamesPlayed: user.numberOfGamesPlayed,
  };
};

export const incrementGamesPlayed = async (userId: number) => {
  const { canPlay } = await canUserPlay(userId);

  if (!canPlay) {
    throw new ActionError({
      code: "TOO_MANY_REQUESTS", //insteaf of 404 BAD_REQUEST. I think this is the best for quota exceeded.
      message: "Maximum number of games reached",
    });
  }

  try {
    const [updated] = await db
      .update(christmas21QuestionsUsers)
      .set({
        numberOfGamesPlayed: sql`${christmas21QuestionsUsers.numberOfGamesPlayed} + 1`,
      })
      .where(eq(christmas21QuestionsUsers.id, userId))
      .returning();

    return updated;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error incrementing games played: " + errorMessage);
  }
};
