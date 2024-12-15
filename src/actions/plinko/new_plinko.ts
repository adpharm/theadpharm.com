import { db } from "@/db";
import { tablePlinkoGameRounds, tablePlinkoGames } from "@/db/schema";
import { requireAuth } from "@/lib/server/auth_utils";
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
export const newPlinko = defineAction({
  // accept: "form",
  input: z.object({}),
  handler: async (inputData, context) => {
    requireAuth(context);

    const res = await db.transaction(async (trx) => {
      // create a new plinko game
      const newPlinkoGame = await trx
        .insert(tablePlinkoGames)
        .values({
          current_round_key: "rnd1",
        })
        .returning();

      if (newPlinkoGame.length === 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create plinko game",
        });
      }

      // create the first round
      const round1 = await trx
        .insert(tablePlinkoGameRounds)
        .values({
          key: "rnd1",
          pocket_middle_value: 10000,
          pocket_middle_left_1_value: 0,
          pocket_middle_right_1_value: 0,
          pocket_middle_left_2_value: 1000,
          pocket_middle_right_2_value: 1000,
          pocket_middle_left_3_value: 500,
          pocket_middle_right_3_value: 500,
          game_id: newPlinkoGame[0].id,
        })
        .returning();

      if (round1.length === 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create plinko round",
        });
      }

      return {
        game: newPlinkoGame[0],
        round: round1[0],
      };
    });

    return res;
  },
});
