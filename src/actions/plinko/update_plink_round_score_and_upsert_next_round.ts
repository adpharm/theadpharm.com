import { db } from "@/db";
import { tablePlinkoGameRounds, tablePlinkoGames } from "@/db/schema";
import { requireAuth } from "@/lib/server/auth_utils";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq, sql } from "drizzle-orm";

/**
 *
 *
 *
 */
export const updatePlinkoRoundScoreAndUpsertNextRound = defineAction({
  // accept: "form",
  input: z.object({
    roundScore: z.number(),
    roundId: z.number(),
  }),
  handler: async (inputData, context) => {
    requireAuth(context);

    const res = await db.transaction(async (trx) => {
      // update the round score
      const updatedRound = await trx
        .update(tablePlinkoGameRounds)
        .set({
          score: inputData.roundScore,
        })
        .where(eq(tablePlinkoGameRounds.id, inputData.roundId))
        .returning();

      if (updatedRound.length === 0) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Round not found",
        });
      }

      const updatedRoundData = updatedRound[0];

      const insertData: typeof tablePlinkoGameRounds.$inferInsert = {
        key: getNextRoundKey(updatedRoundData.key),
        pocket_middle_value: updatedRoundData.pocket_middle_value,
        pocket_middle_left_1_value: updatedRoundData.pocket_middle_left_1_value,
        pocket_middle_right_1_value:
          updatedRoundData.pocket_middle_right_1_value,
        pocket_middle_left_2_value: updatedRoundData.pocket_middle_left_2_value,
        pocket_middle_right_2_value:
          updatedRoundData.pocket_middle_right_2_value,
        pocket_middle_left_3_value: updatedRoundData.pocket_middle_left_3_value,
        pocket_middle_right_3_value:
          updatedRoundData.pocket_middle_right_3_value,
        game_id: updatedRoundData.game_id,
      };

      // create/update a round, copying the board configuration from the previous round
      const nextRound = await trx
        .insert(tablePlinkoGameRounds)
        .values(insertData)
        .onConflictDoUpdate({
          target: [tablePlinkoGameRounds.game_id, tablePlinkoGameRounds.key],
          set: insertData,
        })
        .returning();

      if (nextRound.length === 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create plinko round",
        });
      }

      const nextRoundData = nextRound[0];

      // update the game with:
      //   - the new round key
      //   - updated score
      const game = await trx
        .update(tablePlinkoGames)
        .set({
          current_round_key: nextRoundData.key,
          score: sql`${tablePlinkoGames.score} + ${inputData.roundScore}`,
        })
        .where(eq(tablePlinkoGames.id, updatedRoundData.game_id))
        .returning();

      if (game.length === 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update plinko game",
        });
      }

      const updatedGameData = game[0];

      return {
        updatedRound: updatedRoundData,
        nextRound: nextRoundData,
        updatedGame: updatedGameData,
      };
    });

    return res;
  },
});

function getNextRoundKey(
  currentRoundKey: (typeof tablePlinkoGames.current_round_key.enumValues)[number],
): (typeof tablePlinkoGames.current_round_key.enumValues)[number] {
  const currentRoundKeyNumber = currentRoundKey.split("rnd")[1];
  const nextRoundKeyNumber = parseInt(currentRoundKeyNumber) + 1;
  return `rnd${nextRoundKeyNumber}` as any;
}
