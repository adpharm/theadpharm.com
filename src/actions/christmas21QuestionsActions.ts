import { requireUserForAction } from "@/lib/server/auth.utils";

import { db } from "@/db";
import {
  christmas21QuestionsGames,
  tableUsers,
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
            user_id: user.id,
            createdAt: new Date(),
          })
          .returning();

        // Then increment games played

        // I was getting this error: https://community.neon.tech/t/how-do-i-handle-transactions/1067
        // NeonDB HTTP driver doesn't support transactions this way. We need to create the operations sequentially -- https://community.neon.tech/t/how-do-i-handle-transactions/1067
        const [updated] = await db
          .update(tableUsers)
          .set({
            number_of_twenty_one_games_played: tableUsers.number_of_twenty_one_games_played,
          })
          .where(eq(tableUsers.id, user.id))
          .returning();

        return {
          success: true,
          game: game,
          meta: {
            gamesRemaining: gamesRemaining - 2,
            gamesPlayed: updated.number_of_twenty_one_games_played,
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
    .from(tableUsers)
    .where(eq(tableUsers.id, userId))
    .limit(1);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    canPlay: (user.number_of_twenty_one_games_played ?? 0) < MAX_GAMES,
    gamesRemaining: MAX_GAMES - (user.number_of_twenty_one_games_played ?? 0),
    gamesPlayed: user.number_of_twenty_one_games_played ?? 0,
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
      .update(tableUsers)
      .set({
        number_of_twenty_one_games_played: sql`${tableUsers.number_of_twenty_one_games_played} + 1`,
      })
      .where(eq(tableUsers.id, userId))
      .returning();

    return updated;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error("Error incrementing games played: " + errorMessage);
  }
};
