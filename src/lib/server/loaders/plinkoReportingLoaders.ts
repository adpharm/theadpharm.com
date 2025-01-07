import {
  PlinkoGameOverDialog,
  PlinkoRoundEndedDialog,
  PlinkoRoundWaitingToStartDialog,
} from "@/components/dialog/PlinkoRoundDialog";
import { db } from "@/db";
import { tablePlinkoGames, tableUsers } from "@/db/schema";
import { $leaderboard, $gamesScores, $allUsers } from "@/lib/stores";
import { desc, eq, gt } from "drizzle-orm";

export async function listTop10Games() {
  // Get the top 10 games by score
  const top10Games = await db
    .select({
      game: tablePlinkoGames,
      user: tableUsers,
    })
    .from(tablePlinkoGames)
    .where(gt(tablePlinkoGames.score, 0))
    .innerJoin(tableUsers, eq(tablePlinkoGames.user_id, tableUsers.id))
    .orderBy(desc(tablePlinkoGames.score))
    .limit(10);

  $leaderboard.set(top10Games);
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
    .select({
      user: tableUsers,
    })
    .from(tableUsers);

  $allUsers.set(allUsers.map((u) => u.user));
}
