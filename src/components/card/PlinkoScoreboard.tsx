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

  async function playAgain() {
    const { data, error } = await actions.newPlinko({});
    if (error) {
      console.error("Error creating new game", error);
      return;
    }

    console.log("New game created", data);

    // redirect to the new game
    // Astro.redirect(`/digital/plinko/${data.game.id}`);
    window.location.href = `/digital/plinko/${data.game.id}`;
  }

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

      <CardFooter>
        <Button type="button" onClick={playAgain} className="w-full">
          Play again
        </Button>
      </CardFooter>
    </Card>
  );
}
