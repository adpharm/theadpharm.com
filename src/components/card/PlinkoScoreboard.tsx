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
import { useState, type ReactNode } from "react";
import { ClientOnly } from "@/lib/utils.react-hydration";
import { logDebug } from "@/lib/utils.logger";
import { cn } from "@/lib/utils";
import { getPagePath } from "@nanostores/router";
import { $router } from "@/lib/stores/router";
import { makePrettyNumber } from "@/lib/utils.numbers";
import { PlinkoBallArsenal } from "../misc/PlinkoBallArsenal";

export function PlinkoScoreboardUi({
  className,
  title,
  roundScore,
}: {
  className?: string;
  title: ReactNode;
  roundScore: number;
}) {
  return (
    <div className={cn(className)}>
      <h1 className="text-center text-red-500 text-2xl">{title}</h1>

      <div className={"relative"}>
        <img
          src="/plinko/other/Scoreboard.webp"
          className="object-contain w-full"
        />

        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <p className="text-xl font-mono text-green-500">{roundScore}</p>
        </div>
      </div>
    </div>
  );
}

export function PlinkoScoreboard({ className }: { className?: string }) {
  const currentRoundScore = useStore($roundScore);
  const currentRoundData = useStore($currentRoundRemoteData);
  const gameRemoteData = useStore($gameRemoteData);

  const roundScore = currentRoundScore;
  const gameScore = gameRemoteData?.score || 0;
  const roundNum = currentRoundData?.key.split("rnd")[1] || "-";

  return (
    <PlinkoScoreboardUi
      className={className}
      title={`Round ${roundNum} / 10`}
      roundScore={roundScore}
    />
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
        "text-center w-full bg-sky-50 border-0 text-sky-900",
        embeddedInDialog ? "border-0 bg-transparent" : "",
      )}
    >
      <CardHeader
        className={cn(embeddedInDialog ? "p-0 pb-6" : "pb-0")}
      ></CardHeader>

      <CardContent className={cn(embeddedInDialog ? "p-0 pb-6" : "")}>
        {currentRoundScore > 0 ? (
          <>
            <p>Final round score:</p>
            <p>{makePrettyNumber(currentRoundScore)}</p>
          </>
        ) : null}

        <p></p>

        <PlinkoScoreboardUi roundScore={gameScore} title={"Final score:"} />
      </CardContent>

      <CardFooter className={cn("grid gap-2", embeddedInDialog ? "p-0" : "")}>
        <Button type="button" asChild variant={"secondaryWinter"}>
          <a href={getPagePath($router, "games.plinko.home")}>
            {embeddedInDialog ? "View leaderboard" : "Return home"}
          </a>
        </Button>

        <Button
          type="button"
          onClick={() => {
            setIsCreatingGame(true);
            newPlinkoGame();
          }}
          className="w-full"
          variant={"primaryWinter"}
        >
          {isCreatingGame ? "Creating game..." : "Play again"}
        </Button>
      </CardFooter>
    </Card>
  );
}
