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

export function UserPlinkoGamesTable() {
  const userGamesTableData = useStore($userGamesTable);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [isContinuingToGameId, setIsContinuingToGameId] = useState<
    number | null
  >(null);

  return (
    <div>
      <div className="flex items-end justify-start">
        <div className="flex-1"></div>

        <Button
          type="button"
          onClick={() => {
            setIsCreatingGame(true);
            newPlinkoGame();
          }}
        >
          {isCreatingGame ? "Creating game..." : "New game"}
        </Button>
      </div>

      <Table>
        <TableCaption>Your games.</TableCaption>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="w-[100px]">Rank</TableHead> */}
            <TableHead>Game</TableHead>
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
                  <ClientOnly fallback={<span>Loading...</span>}>
                    {() => convertUTCToDistanceToNow(game.created_at)}
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
                <TableCell className="text-right">{game.score}</TableCell>
                <TableCell className="text-right">
                  {!game.game_over && (
                    <Button
                      type="button"
                      asChild
                      onClick={() => setIsContinuingToGameId(game.id)}
                    >
                      <a href={`/digital/plinko/${game.id}`}>
                        {isContinuingToGameId === game.id
                          ? "Loading..."
                          : "Continue"}
                      </a>
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
