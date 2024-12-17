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

      // get the next round key
      const nextRoundKey = getNextRoundKey(updatedRoundData.key);
      let nextRoundData: typeof tablePlinkoGameRounds.$inferSelect | null =
        null;

      // if the next round key is null, we're done
      if (nextRoundKey === null) {
        nextRoundData = null;
      } else {
        // create/update a round, copying the board configuration from the previous round
        const nextRoundInsertData: typeof tablePlinkoGameRounds.$inferInsert = {
          key: nextRoundKey,
          pocket_middle_value: updatedRoundData.pocket_middle_value,
          pocket_middle_left_1_value:
            updatedRoundData.pocket_middle_left_1_value,
          pocket_middle_right_1_value:
            updatedRoundData.pocket_middle_right_1_value,
          pocket_middle_left_2_value:
            updatedRoundData.pocket_middle_left_2_value,
          pocket_middle_right_2_value:
            updatedRoundData.pocket_middle_right_2_value,
          pocket_middle_left_3_value:
            updatedRoundData.pocket_middle_left_3_value,
          pocket_middle_right_3_value:
            updatedRoundData.pocket_middle_right_3_value,
          game_id: updatedRoundData.game_id,
        };

        const nextRound = await trx
          .insert(tablePlinkoGameRounds)
          .values(nextRoundInsertData)
          .onConflictDoUpdate({
            target: [tablePlinkoGameRounds.game_id, tablePlinkoGameRounds.key],
            set: nextRoundInsertData,
          })
          .returning();

        if (nextRound.length === 0) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create plinko round",
          });
        }

        nextRoundData = nextRound[0];
      }

      // update the game with:
      //   - the new round key (if there is one)
      //   - updated score
      const updateData: Partial<typeof tablePlinkoGames.$inferInsert> = {
        // @ts-expect-error - we know this is valid
        score: sql`${tablePlinkoGames.score} + ${inputData.roundScore}`,
      };

      // if there is no next round, the game is over
      if (nextRoundData === null) {
        updateData.game_over = true;
      } else {
        updateData.current_round_key = nextRoundData.key;
      }

      const game = await trx
        .update(tablePlinkoGames)
        .set(updateData)
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
): (typeof tablePlinkoGames.current_round_key.enumValues)[number] | null {
  return currentRoundKey === "rnd1"
    ? "rnd2"
    : currentRoundKey === "rnd2"
      ? "rnd3"
      : currentRoundKey === "rnd3"
        ? "rnd4"
        : currentRoundKey === "rnd4"
          ? "rnd5"
          : currentRoundKey === "rnd5"
            ? "rnd6"
            : currentRoundKey === "rnd6"
              ? "rnd7"
              : currentRoundKey === "rnd7"
                ? "rnd8"
                : currentRoundKey === "rnd8"
                  ? "rnd9"
                  : currentRoundKey === "rnd9"
                    ? "rnd10"
                    : null;
}