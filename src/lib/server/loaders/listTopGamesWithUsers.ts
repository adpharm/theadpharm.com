import {
  PlinkoGameOverDialog,
  PlinkoRoundEndedDialog,
  PlinkoRoundWaitingToStartDialog,
} from "@/components/dialog/PlinkoRoundDialog";
import { db } from "@/db";
import { tablePlinkoGames, tableUsers } from "@/db/schema";
import { $leaderboard } from "@/lib/stores";
import { desc, eq, gt } from "drizzle-orm";

export async function listTopGamesWithUsers() {
  // Get the top 10 games by score
  const topGamesWithUsers = await db
    .select({
      game: tablePlinkoGames,
      user: tableUsers,
    })
    .from(tablePlinkoGames)
    .where(gt(tablePlinkoGames.score, 0))
    .innerJoin(tableUsers, eq(tablePlinkoGames.user_id, tableUsers.id))
    .orderBy(desc(tablePlinkoGames.score))
    .limit(10);

  $leaderboard.set(topGamesWithUsers);
}
