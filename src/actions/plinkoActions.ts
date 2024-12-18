import { db } from "@/db";
import { tablePlinkoGameRounds, tablePlinkoGames } from "@/db/schema";
import { requireUserForAction } from "@/lib/server/auth.utils";
import { logDebug } from "@/lib/utils.logger";
import { upgradePlinkoGameSchema } from "@/lib/zod.schema";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq, sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

export const plinko = {
  /*****************************************************************************************************************************
   *
   *
   * For creating a new plinko game
   *
   *
   ****************************************************************************************************************************/
  newGame: defineAction({
    input: undefined,
    handler: async (inputData, context) => {
      const user = requireUserForAction(context);

      const res = await db.transaction(async (trx) => {
        // create a new plinko game
        const newPlinkoGame = await trx
          .insert(tablePlinkoGames)
          .values({
            current_round_key: "rnd1",
            user_id: user.id,
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
  }),

  /***************************************************************************************************************************
   *
   *
   * For ending a plinko game round
   *
   *
   ***************************************************************************************************************************/
  updateScoreAndCreateNextRound: defineAction({
    // accept: "form",
    input: z.object({
      roundScore: z.number(),
      roundId: z.number(),
    }),
    handler: async (inputData, context) => {
      requireUserForAction(context);

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
          // TODO: this is unsafe.
          const {
            id: _id,
            created_at: _created_at,
            updated_at: _updated_at,
            upgraded: _upgraded,
            score: _score,
            key: _key,
            ...updatedDataSafeForCopy
          } = updatedRoundData;

          const nextRoundInsertData: typeof tablePlinkoGameRounds.$inferInsert =
            {
              ...updatedDataSafeForCopy,
              key: nextRoundKey,
              game_id: updatedRoundData.game_id,
            };

          const nextRound = await trx
            .insert(tablePlinkoGameRounds)
            .values(nextRoundInsertData)
            .onConflictDoUpdate({
              target: [
                tablePlinkoGameRounds.game_id,
                tablePlinkoGameRounds.key,
              ],
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
  }),

  /***************************************************************************************************************************
   *
   *
   * For upgrading
   *
   *
   ***************************************************************************************************************************/
  updateBoardWithUpgrade: defineAction({
    input: upgradePlinkoGameSchema,
    handler: async (inputData, context) => {
      // ensure the user is logged in
      requireUserForAction(context);

      // update
      const updateData: Partial<typeof tablePlinkoGameRounds.$inferInsert> = {
        upgraded: true, // mark the round as upgraded
      };

      // add 1 ball
      if (inputData.add1Ball) {
        // find the first ball that is off and turn it on
        if (inputData.roundData.plinko_ball_1_on === false) {
          updateData.plinko_ball_1_on = true;
        } else if (inputData.roundData.plinko_ball_2_on === false) {
          updateData.plinko_ball_2_on = true;
        } else if (inputData.roundData.plinko_ball_3_on === false) {
          updateData.plinko_ball_3_on = true;
        } else if (inputData.roundData.plinko_ball_4_on === false) {
          updateData.plinko_ball_4_on = true;
        } else if (inputData.roundData.plinko_ball_5_on === false) {
          updateData.plinko_ball_5_on = true;
        } else if (inputData.roundData.plinko_ball_6_on === false) {
          updateData.plinko_ball_6_on = true;
        } else if (inputData.roundData.plinko_ball_7_on === false) {
          updateData.plinko_ball_7_on = true;
        } else if (inputData.roundData.plinko_ball_8_on === false) {
          updateData.plinko_ball_8_on = true;
        } else if (inputData.roundData.plinko_ball_9_on === false) {
          updateData.plinko_ball_9_on = true;
        } else if (inputData.roundData.plinko_ball_10_on === false) {
          updateData.plinko_ball_10_on = true;
        } else {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "No more balls to add",
          });
        }
      }

      // make a ball golden
      if (inputData.makeRandomBallGolden) {
        // generate a list of numbers from 1 to 10 in random order
        const randomOrder = Array.from({ length: 10 }, (_, i) => i + 1).sort(
          () => Math.random() - 0.5,
        );

        let madeABallGolden = false;

        // find the first ball that is on and not golden and make it golden
        for (const ballNumber of randomOrder) {
          const ballOnKey =
            `plinko_ball_${ballNumber}_on` as "plinko_ball_1_on";
          const ballPowerUpsKey =
            `plinko_ball_${ballNumber}_power_ups` as "plinko_ball_1_power_ups";
          if (
            inputData.roundData[ballOnKey] === true &&
            !inputData.roundData[ballPowerUpsKey].includes("golden")
          ) {
            updateData[ballPowerUpsKey] = [
              ...inputData.roundData[ballPowerUpsKey],
              "golden",
            ];
            madeABallGolden = true;
            break;
          }
        }

        if (!madeABallGolden) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "No balls to make golden",
          });
        }
      }

      const upgradedRound = await db
        .update(tablePlinkoGameRounds)
        .set(updateData)
        .where(eq(tablePlinkoGameRounds.id, inputData.roundData.id))
        .returning();

      if (upgradedRound.length === 0) {
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upgrade plinko round",
        });
      }

      return upgradedRound[0];
    },
  }),
};

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
