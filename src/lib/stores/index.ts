import type {
  tablePlinkoGameRounds,
  tablePlinkoGames,
  tableUsers,
} from "@/db/schema";
import { shared } from "@it-astro:request-nanostores";
import { atom, computed, deepMap, map } from "nanostores";
import type { plinkoSettings } from "../settings.plinko";

export const $roundResult = atom<{
  score: number;
  roundId: number;
  scoreMultiplier: number;
} | null>(null);

export type PlinkoBallData = {
  key: (typeof plinkoSettings.plinkoBallKeys)[number];
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

export const $settingUpGame = atom(true);

export const mobileCanvasSettings = {
  width: 300,
  height: 600,
  pegSize: 7,
  pegRows: 17,
  ballSize: 9,
};

export const desktopCanvasSettings = {
  width: 400,
  height: 600,
  pegSize: 10,
  pegRows: 17,
  ballSize: 11,
};

export const $canvasSettings = shared(
  "canvasSettings",
  atom(desktopCanvasSettings),
);

// <{
//   width: number;
//   height: number;
//   pegSize: number;
//   pegRows: number; // should be odd
// }>({ width: 400, height: 600, pegSize: 10, pegRows: 17 });
