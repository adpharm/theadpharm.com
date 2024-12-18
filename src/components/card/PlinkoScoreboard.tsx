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
  $remainingPlinkoBallsThisRound,
  $roundScore,
} from "@/lib/stores";
import { Button } from "../ui/button";
import { actions } from "astro:actions";
import { newPlinkoGame } from "@/lib/client/newPlinkoGame";
import { useState } from "react";
import { ClientOnly } from "@/lib/utils.react-hydration";
import { logDebug } from "@/lib/utils.logger";
import { cn } from "@/lib/utils";

export function PlinkoScoreboard() {
  const currentRoundScore = useStore($roundScore);
  const currentRoundData = useStore($currentRoundRemoteData);
  const gameRemoteData = useStore($gameRemoteData);
  const plinkoBallsRemaining = useStore($remainingPlinkoBallsThisRound);

  const roundScore = currentRoundScore;
  const gameScore = gameRemoteData?.score || 0;
  const roundNum = currentRoundData?.key.split("rnd")[1] || "-";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Round {roundNum}/10</CardTitle>
        {/* <CardDescription></CardDescription> */}
      </CardHeader>

      <CardContent>
        <p>Round score: {roundScore}</p>
        <p>Game score: {gameScore}</p>
      </CardContent>

      <CardFooter className="block">
        <ClientOnly>
          {() => (
            <div className="grid grid-cols-10 gap-2">
              {plinkoBallsRemaining.map((ball, idx) => {
                return (
                  <div
                    // TODO: bad key
                    key={`ball-${idx}`}
                    className={cn(
                      "aspect-square bg-red-500 rounded-full",
                      ball.powerUps.includes("golden") ? "bg-yellow-500" : "",
                    )}
                  ></div>
                );
              })}
            </div>
          )}
        </ClientOnly>
      </CardFooter>
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
