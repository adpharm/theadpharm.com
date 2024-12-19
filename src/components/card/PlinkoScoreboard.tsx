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
import { getPagePath } from "@nanostores/router";
import { $router } from "@/lib/stores/router";
import { makePrettyNumber } from "@/lib/utils.numbers";

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
                    className="aspect-square"
                  >
                    <div
                      className={cn(
                        "size-full bg-red-500 rounded-full border-2 border-transparent",
                        ball.powerUps.includes("golden") ? "bg-yellow-500" : "",
                        idx === 0 ? "border-white" : "",
                      )}
                    ></div>
                  </div>
                );
              })}
            </div>
          )}
        </ClientOnly>
      </CardFooter>
    </Card>
  );
}

export function GameOverScoreboard({
  embeddedInDialog,
}: {
  embeddedInDialog?: boolean;
}) {
  const currentRoundScore = useStore($roundScore);
  const gameRemoteData = useStore($gameRemoteData);
  const gameScore = gameRemoteData?.score || 0;
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  return (
    <Card
      className={cn(
        "text-center w-full",
        embeddedInDialog ? "border-0 bg-transparent" : "",
      )}
    >
      <CardHeader className={cn(embeddedInDialog ? "p-0 pb-6" : "")}>
        <CardTitle>Thanks for playing!</CardTitle>
        <CardDescription>Now get back to work.</CardDescription>
      </CardHeader>

      <CardContent className={cn(embeddedInDialog ? "p-0 pb-6" : "")}>
        {currentRoundScore > 0 ? (
          <>
            <p>Final round score:</p>
            <p>{makePrettyNumber(currentRoundScore)}</p>
          </>
        ) : null}

        <p>Final score:</p>
        <p>{makePrettyNumber(gameScore)}</p>
      </CardContent>

      <CardFooter className={cn("grid gap-2", embeddedInDialog ? "p-0" : "")}>
        <Button type="button" asChild variant={"secondary"}>
          <a href={getPagePath($router, "games.plinko.home")}>Go home</a>
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
