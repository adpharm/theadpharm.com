import type { tablePlinkoGames } from "@/db/schema";

export function parsePlinkoRoundNum(
  roundKey: (typeof tablePlinkoGames.current_round_key.enumValues)[number],
) {
  return parseInt(roundKey.replace("rnd", ""));
}
