import { db } from "@/db";
import { tablePlinkoGameRounds, tablePlinkoGames } from "@/db/schema";
import { requireUserForAction } from "@/lib/server/auth.utils";
import type { plinkoSettings } from "@/lib/settings.plinko";
import { upgradeSettings } from "@/lib/settings.plinkoUpgrades";
import { logDebug } from "@/lib/utils.logger";
import {
  upgradePlinkoGameKeys,
  upgradePlinkoGameSchema,
} from "@/lib/zod.schema";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { eq, sql } from "drizzle-orm";
import { match } from "ts-pattern";

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
            did_select_upgrade: _upgraded,
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
          // @ts-expect-error - we know this is valid
          upgrade_budget: sql`${tablePlinkoGames.upgrade_budget} + ${inputData.roundScore}`,
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
      let updateData: Partial<typeof tablePlinkoGameRounds.$inferInsert> = {
        did_select_upgrade: true, // mark the round as upgraded
      };

      // get the upgrade function
      const upgradeFunction = upgrades[inputData.upgradeKey];

      if (!upgradeFunction) {
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Invalid upgrade key",
        });
      }

      // run the upgrade
      updateData = upgradeFunction(inputData, updateData);

      return await db.transaction(async (trx) => {
        const upgradedRound = await trx
          .update(tablePlinkoGameRounds)
          .set(updateData)
          .where(eq(tablePlinkoGameRounds.id, inputData.roundData.id))
          .returning();

        if (upgradedRound.length === 0) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Sorry, failed to upgrade plinko round",
          });
        }

        // take away the upgrade budget
        const gameUpdateData: Partial<typeof tablePlinkoGames.$inferInsert> = {
          upgrade_budget:
            sql`${tablePlinkoGames.upgrade_budget} - ${upgradeSettings[inputData.upgradeKey].cost}` as unknown as number,
        };

        const updatedGame = await trx
          .update(tablePlinkoGames)
          .set(gameUpdateData)
          .where(eq(tablePlinkoGames.id, inputData.roundData.game_id))
          .returning();

        if (updatedGame.length === 0) {
          throw new ActionError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Sorry, failed to update plinko game",
          });
        }

        return upgradedRound[0];
      });
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

/**
 *
 *
 *
 * plinko upgrades
 *
 *
 */

const upgrades: Record<
  (typeof upgradePlinkoGameKeys)[number],
  (
    inputData: z.infer<typeof upgradePlinkoGameSchema>,
    updateData: Partial<typeof tablePlinkoGameRounds.$inferInsert>,
  ) => Partial<typeof tablePlinkoGameRounds.$inferInsert>
> = {
  /**
   * Do nothing
   */
  none: (inputData, updateData) => {
    return updateData;
  },
  /**
   *  Add 2 normal balls
   */
  addNormalBall: (inputData, updateData) => {
    // find the first ball that is off and turn it on
    if (inputData.roundData.plinko_ball_6_on === false) {
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

    return updateData;
  },

  /**
   *  Add 2 normal balls
   */
  add2NormalBalls: (inputData, updateData) => {
    updateData = upgrades.addNormalBall(inputData, updateData);
    updateData = upgrades.addNormalBall(inputData, updateData);

    return updateData;
  },

  /**
   * Add a golden ball
   */
  addGoldenBall: (inputData, updateData) => {
    // find the first ball that is off and not golden turn it on and make it golden
    if (
      inputData.roundData.plinko_ball_6_on === false &&
      !updateData.plinko_ball_6_power_ups?.includes("golden")
    ) {
      updateData.plinko_ball_6_on = true;
      updateData.plinko_ball_6_power_ups?.push("golden");
    } else if (
      inputData.roundData.plinko_ball_7_on === false &&
      !updateData.plinko_ball_7_power_ups?.includes("golden")
    ) {
      updateData.plinko_ball_7_on = true;
      updateData.plinko_ball_7_power_ups?.push("golden");
    } else if (
      inputData.roundData.plinko_ball_8_on === false &&
      !updateData.plinko_ball_8_power_ups?.includes("golden")
    ) {
      updateData.plinko_ball_8_on = true;
      updateData.plinko_ball_8_power_ups?.push("golden");
    } else if (
      inputData.roundData.plinko_ball_9_on === false &&
      !updateData.plinko_ball_9_power_ups?.includes("golden")
    ) {
      updateData.plinko_ball_9_on = true;
      updateData.plinko_ball_9_power_ups?.push("golden");
    } else if (
      inputData.roundData.plinko_ball_10_on === false &&
      !updateData.plinko_ball_10_power_ups?.includes("golden")
    ) {
      updateData.plinko_ball_10_on = true;
      updateData.plinko_ball_10_power_ups?.push("golden");
    } else {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "No more balls to add",
      });
    }

    return updateData;
  },

  /**
   * Increase a pocket value by 3000
   */
  pocketValuePlus3000: (inputData, updateData) => {
    const pocketKey = inputData.pocketValuePlus3000;
    if (!pocketKey) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "No pocket was selected!",
      });
    }

    return updatePocketValueInUpdateData(
      inputData,
      updateData,
      pocketKey,
      3000,
    );
  },

  /**
   * Increase a pocket value by 6000
   */
  pocketValuePlus6000: (inputData, updateData) => {
    const pocketKey = inputData.pocketValuePlus6000;
    if (!pocketKey) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "No pocket was selected!",
      });
    }

    return updatePocketValueInUpdateData(
      inputData,
      updateData,
      pocketKey,
      6000,
    );
  },

  /**
   * Increase a pocket value by 9000
   */
  pocketValuePlus9000: (inputData, updateData) => {
    const pocketKey = inputData.pocketValuePlus9000;
    if (!pocketKey) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "No pocket was selected!",
      });
    }

    return updatePocketValueInUpdateData(
      inputData,
      updateData,
      pocketKey,
      9000,
    );
  },

  /**
   * Multiply the payout by 1.5
   */
  multiplyPayoutBy1_5: (inputData, updateData) => {
    updateData.score_multiplier = 1.5;
    return updateData;
  },

  /**
   * Multiply the payout by 2
   */
  multiplyPayoutBy2: (inputData, updateData) => {
    updateData.score_multiplier = 2;
    return updateData;
  },

  /**
   * Multiply the payout by 3
   */
  multiplyPayoutBy3: (inputData, updateData) => {
    updateData.score_multiplier = 3;
    return updateData;
  },
};

function updatePocketValueInUpdateData(
  inputData: z.infer<typeof upgradePlinkoGameSchema>,
  updateData: Partial<typeof tablePlinkoGameRounds.$inferInsert>,
  pocketKey: (typeof plinkoSettings.pocketKeys)[number],
  pocketValue: number,
) {
  match(pocketKey)
    .with(
      "pocket_middle",
      () =>
        (updateData.pocket_middle_value =
          inputData.roundData.pocket_middle_value + pocketValue),
    )
    .with(
      "pocket_middle_left_1",
      () =>
        (updateData.pocket_middle_left_1_value =
          inputData.roundData.pocket_middle_left_1_value + pocketValue),
    )
    .with(
      "pocket_middle_right_1",
      () =>
        (updateData.pocket_middle_right_1_value =
          inputData.roundData.pocket_middle_right_1_value + pocketValue),
    )
    .with(
      "pocket_middle_left_2",
      () =>
        (updateData.pocket_middle_left_2_value =
          inputData.roundData.pocket_middle_left_2_value + pocketValue),
    )
    .with(
      "pocket_middle_right_2",
      () =>
        (updateData.pocket_middle_right_2_value =
          inputData.roundData.pocket_middle_right_2_value + pocketValue),
    )
    .with(
      "pocket_middle_left_3",
      () =>
        (updateData.pocket_middle_left_3_value =
          inputData.roundData.pocket_middle_left_3_value + pocketValue),
    )
    .with(
      "pocket_middle_right_3",
      () =>
        (updateData.pocket_middle_right_3_value =
          inputData.roundData.pocket_middle_right_3_value + pocketValue),
    )
    .exhaustive();

  return updateData;
}
