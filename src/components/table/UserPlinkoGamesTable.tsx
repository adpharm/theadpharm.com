import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { $userGamesTable } from "@/lib/stores";
import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import { newPlinkoGame } from "@/lib/client/newPlinkoGame";
import { parsePlinkoRoundNum } from "@/lib/parsePlinkoRoundNum";
import {
  convertUTCToDistanceToNow,
  convertUTCToLocalTime,
} from "@/lib/utils.plinko.date";
import { ClientOnly } from "@/lib/utils.react-hydration";
import { useState } from "react";
import { getPagePath } from "@nanostores/router";
import { $router } from "@/lib/stores/router";
import { makePrettyNumber } from "@/lib/utils.numbers";

export function UserPlinkoGamesTable() {
  const userGamesTableData = useStore($userGamesTable);
  const [isContinuingToGameId, setIsContinuingToGameId] = useState<
    number | null
  >(null);

  return (
    <div className="overflow-x-scroll">
      <h2 className="text-xl text-sky-900/80 text-center">
        Your Current and Past Games
      </h2>

      <Table>
        {/* <TableCaption>Your games.</TableCaption> */}
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Rank</TableHead> */}
            <TableHead>Last played</TableHead>
            <TableHead className="">Progress</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="text-right w-[200px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userGamesTableData.map((rowData, idx) => {
            const game = rowData;
            return (
              <TableRow key={`game-${game.id}`}>
                {/* <TableCell>{idx + 1}</TableCell> */}
                <TableCell className="font-medium">
                  <ClientOnly
                    fallback={<span>Loading...&nbsp;&nbsp;&nbsp;&nbsp;</span>}
                  >
                    {() => (
                      <span className="capitalize">
                        {convertUTCToDistanceToNow(game.updated_at)}
                      </span>
                    )}
                  </ClientOnly>
                </TableCell>
                <TableCell>
                  {game.game_over ? (
                    <span>Completed</span>
                  ) : (
                    <span>
                      Round {parsePlinkoRoundNum(game.current_round_key)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {makePrettyNumber(game.score)}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    type="button"
                    asChild
                    variant={"primaryWinter"}
                    onClick={() => setIsContinuingToGameId(game.id)}
                  >
                    <a
                      href={getPagePath($router, "games.plinko.gameId", {
                        gameId: game.id,
                      })}
                    >
                      {isContinuingToGameId === game.id
                        ? "Loading..."
                        : game.game_over
                          ? "Review"
                          : "Continue"}
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
