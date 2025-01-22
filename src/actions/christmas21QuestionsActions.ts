import { requireUserForAction } from "@/lib/server/auth.utils";

import { db } from "@/db";
import {
  christmas21QuestionsGames,
  christmas21QuestionsUsers,
} from "@/db/schema";
import { ActionError, defineAction } from "astro:actions";
import { eq, sql } from "drizzle-orm";
import {
  canUserPlay,
  incrementGamesPlayed,
} from "@/lib/server/21QuestionsLogic";
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
  //     async newGame(context: APIContext) {
  //       const user = requireUserForAction(context);

  //       if (!user || !user.id) {
  //         throw new ActionError({
  //           code: "UNAUTHORIZED",
  //           message: "User authentication required.",
  //         });
  //       }

  //       const { canPlay, gamesRemaining = 0 } = await canUserPlay(user.id);

  //       if (!canPlay) {
  //         return {
  //           success: false,
  //           error: "Maximum games reached",
  //         };
  //       }

  //       try {
  //         const [newGame] = await db.transaction(async (tx) => {
  //           const [game] = await tx
  //             .insert(christmas21QuestionsGames)
  //             .values({
  //               userId: user.id,
  //               createdAt: new Date(),
  //               gameOver: false,
  //             })
  //             .returning();

  //           await incrementGamesPlayed(user.id);

  //           return [game];
  //         });

  //         return {
  //           success: true,
  //           data: {
  //             game: newGame,
  //             gamesRemaining: gamesRemaining - 1,
  //           },
  //         };
  //       } catch (error) {
  //         console.error("Error during newGame transaction:", error);
  //         throw new ActionError({
  //           code: "INTERNAL_SERVER_ERROR",
  //           message: "Could not create a new game.",
  //         });
  //       }
  //     },

  //     async checkGamesRemaining(
  //       { userId }: { userId?: number },
  //       context: APIContext,
  //     ) {
  //       const user = userId ? { id: userId } : requireUserForAction(context);
  //       const result = await canUserPlay(user.id);
  //       return {
  //         success: true,
  //         data: result,
  //       };
  //     },
  //   },
  // };

  newGame: defineAction({
    input: undefined,
    handler: async (inputData, context) => {
      let new21QuestionsGames: (typeof christmas21QuestionsGames.$inferSelect)[] =
        [];

      try {
        const user = requireUserForAction(context);

        // Check if the user can play
        const { canPlay, gamesRemaining } = await canUserPlay(user.id);

        if (!canPlay) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: `Maximum number of games reached. Games remaining: ${gamesRemaining}`,
          });
        }

        // Create a new game
        new21QuestionsGames = await db
          .insert(christmas21QuestionsGames)
          .values({
            userId: user.id,
            createdAt: new Date(),
            gameOver: false,
          })
          .returning();

        if (new21QuestionsGames.length === 0) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to insert new game into database.",
          });
        }

        // Return the game and remaining games
        return {
          success: true,
          game: new21QuestionsGames[0],
          meta: {
            gamesRemaining,
          },
        };
      } catch (e) {
        // Rollback game if created
        if (new21QuestionsGames.length > 0) {
          logInfo("Rolling back game creation", {
            gameId: new21QuestionsGames[0].id,
          });
          await db
            .delete(christmas21QuestionsGames)
            .where(eq(christmas21QuestionsGames.id, new21QuestionsGames[0].id));
        }

        logDebug("Error during new 21 Questions game creation", e);
        throw e;
      }
    },
  }),
  async checkGamesRemaining(
    { userId }: { userId?: number },
    context: APIContext,
  ) {
    const user = userId ? { id: userId } : requireUserForAction(context);
    const result = await canUserPlay(user.id);
    return {
      success: true,
      data: result,
    };
  },
};
