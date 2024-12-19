import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { tableUsers } from "@/db/schema";
import { $leaderboard } from "@/lib/stores";
import { convertUTCToDistanceToNow } from "@/lib/utils.plinko.date";
import { ClientOnly } from "@/lib/utils.react-hydration";
import { useStore } from "@nanostores/react";

export function LeaderboardTable({
  user,
}: {
  user: typeof tableUsers.$inferSelect | null;
}) {
  const leaderboardData = useStore($leaderboard);

  return (
    <Table>
      <TableCaption>The top scores.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Rank</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboardData.map((rowData, idx) => {
          return (
            <TableRow key={`game-${rowData.game.id}`}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell className="font-medium">
                {rowData.user.username}{" "}
                {rowData.user.id === user?.id ? "(you)" : ""}
              </TableCell>
              <TableCell>
                <ClientOnly>
                  {() => (
                    <span className="capitalize">
                      {convertUTCToDistanceToNow(rowData.game.created_at)}
                    </span>
                  )}
                </ClientOnly>
              </TableCell>
              <TableCell className="text-right">{rowData.game.score}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
