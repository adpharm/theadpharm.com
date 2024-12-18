import type {
  tablePlinkoGameRounds,
  tablePlinkoGames,
  tableUsers,
} from "@/db/schema";
import { shared } from "@it-astro:request-nanostores";
import Matter from "matter-js";
import { atom, computed, deepMap, map } from "nanostores";

/**
 * Store for the number of balls
 */
// export const $numBalls = atom(0);

/**
 * Store for the current round score
 */
// export const $roundScore = atom(0);

/**
 * Store for the current round key
 */
// export const $roundKey = shared(
//   "roundKey",
//   atom<(typeof tablePlinkoGames.current_round_key.enumValues)[number]>("rnd2"),
// );

/**
 * Store for the current plinko round
 */
// export const $currentRound = shared(
//   "currentRound",
//   atom<typeof tablePlinkoGameRounds.$inferSelect | undefined | null>(null),
// );

// export const $currentRoundState = atom<
//   "ended" | "waiting_to_start" | "in_progress" | undefined
// >("waiting_to_start");

// export const $gameState = shared(
//   "gameState",
//   deepMap<{
//     score: number;
//     remoteData: typeof tablePlinkoGames.$inferSelect | undefined | null;
//   }>({
//     score: 0,
//     remoteData: undefined,
//   }),
// );

export const $roundResult = atom<{
  score: number;
  // roundKey: (typeof tablePlinkoGames.current_round_key.enumValues)[number];
  roundId: number;
} | null>(null);

export type PlinkoBallData = {
  powerUps: (typeof tablePlinkoGameRounds.$inferSelect)["plinko_ball_10_power_ups"];
};

export const $remainingPlinkoBallsThisRound = shared(
  "remainingPlinkoBalls",
  atom<PlinkoBallData[]>([]),
);

export const $roundScore = atom(0);

export const $gameState = atom<
  "round_ended" | "round_in_progress" | "waiting_to_start" | "game_over"
>("waiting_to_start");

/**
 * Store for the leaderboard
 */
export const $leaderboard = shared(
  "leaderboard",
  atom<
    {
      game: typeof tablePlinkoGames.$inferSelect;
      user: typeof tableUsers.$inferSelect;
    }[]
  >([]),
);

/**
 * Store for the usersGamesTable
 */
export const $userGamesTable = shared(
  "userGamesTable",
  atom<(typeof tablePlinkoGames.$inferSelect)[]>([]),
);

/**
 * Store for the game's remote data
 */
export const $gameRemoteData = shared(
  "gameRemoteData",
  atom<typeof tablePlinkoGames.$inferSelect | undefined | null>(null),
);

/**
 * Store for the current round remote data
 */
export const $currentRoundRemoteData = shared(
  "currentRoundRemoteData",
  atom<typeof tablePlinkoGameRounds.$inferSelect | undefined | null>(null),
);

/**
 * Store for the next round remote data
 */
export const $nextRoundRemoteData = atom<
  typeof tablePlinkoGameRounds.$inferSelect | undefined | null
>(null);

export const $guestCode = atom("guest");
