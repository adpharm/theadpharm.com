import { useStore } from "@nanostores/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  $currentRoundRemoteData,
  $gameRemoteData,
  $gameState,
  $roundScore,
} from "@/lib/stores";
import { Button } from "../ui/button";
import { actions } from "astro:actions";
import { newPlinkoGame } from "@/lib/client/newPlinkoGame";
import { useState } from "react";

export function PlinkoScoreboard() {
  const currentRoundScore = useStore($roundScore);
  const currentRoundData = useStore($currentRoundRemoteData);
  const gameRemoteData = useStore($gameRemoteData);

  const roundScore = currentRoundScore;
  const gameScore = gameRemoteData?.score || 0;
  const roundNum = currentRoundData?.key.split("rnd")[1] || "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Round {roundNum}</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>

      <CardContent>
        <p>Round score: {roundScore}</p>
        <p>Game score: {gameScore}</p>
      </CardContent>

      <CardFooter></CardFooter>
    </Card>
  );
}

export function GameOverScoreboard() {
  const gameRemoteData = useStore($gameRemoteData);
  const gameScore = gameRemoteData?.score || 0;
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>Thanks for playing!</CardTitle>
        {/* <CardDescription>Final results</CardDescription> */}
      </CardHeader>

      <CardContent>
        <p>Final score:</p>
        <p>{gameScore}</p>
      </CardContent>

      <CardFooter className="grid gap-2">
        <Button type="button" asChild variant={"secondary"}>
          <a href="/digital/plinko">Your games</a>
        </Button>

        <Button
          type="button"
          onClick={() => {
            setIsCreatingGame(true);
            newPlinkoGame();
          }}
          className="w-full"
        >
          {isCreatingGame ? "Creating game..." : "Play again"}
        </Button>
      </CardFooter>
    </Card>
  );
}
