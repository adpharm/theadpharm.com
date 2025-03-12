import {
  PlinkoGameOverDialog,
  PlinkoRoundEndedDialog,
  PlinkoRoundWaitingToStartDialog,
} from "@/components/dialog/PlinkoRoundDialog";
import { db } from "@/db";
import {
  tablePlinkoGames,
  tableUsers,
  tablePlinkoGameRounds,
} from "@/db/schema";
import {
  $leaderboard,
  $gamesScores,
  $allUsers,
  $allGamesWithRounds,
  $allGames,
} from "@/lib/stores";
import { desc, eq, gt } from "drizzle-orm";

export async function listLeaderboardGames() {
  const allLeaderboard = await db
    .select({
      game: tablePlinkoGames,
      user: tableUsers,
    })
    .from(tablePlinkoGames)
    .where(gt(tablePlinkoGames.score, 0))
    .innerJoin(tableUsers, eq(tablePlinkoGames.user_id, tableUsers.id))
    .orderBy(desc(tablePlinkoGames.score));

  $leaderboard.set(allLeaderboard);
}

export async function getAllScores() {
  const scores = await db
    .select({
      score: tablePlinkoGames.score,
    })
    .from(tablePlinkoGames)
    .where(gt(tablePlinkoGames.score, 0));

  $gamesScores.set(scores.map((s) => s.score));
}

export async function getUniqueUsers() {
  const allUsers = await db
    .selectDistinct({ //get unique user IDs
      user: tableUsers,
    })
    .from(tableUsers)
    .innerJoin(tablePlinkoGames, eq(tableUsers.id, tablePlinkoGames.user_id));

  $allUsers.set(allUsers.map((u) => u.user));
}

export async function getGamesWithRounds() {
  const gamesWithRounds = await db
    .select({
      game: tablePlinkoGames,
      gameRound: tablePlinkoGameRounds,
    })
    .from(tablePlinkoGameRounds)
    .innerJoin(
      tablePlinkoGames,
      eq(tablePlinkoGames.id, tablePlinkoGameRounds.game_id),
    )
    .where(gt(tablePlinkoGames.score, 0));

  $allGamesWithRounds.set(gamesWithRounds);
}

export async function getGamesOnly() {
  const games = await db
    .select({
      game: tablePlinkoGames,
    })
    .from(tablePlinkoGames)
    .where(gt(tablePlinkoGames.score, 0));

  $allGames.set(games.map((g) => g.game));
}
