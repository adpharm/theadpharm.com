import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// import { $currentRound, $currentRoundState, $roundScore } from "@/lib/stores";
import { useStore } from "@nanostores/react";
import { Button } from "../ui/button";
import {
  // $currentRoundState,
  // $gameState,
  // $nextRoundRemoteData,
  // resetCurrentRoundToNext,
  $nextRoundRemoteData,
  $currentRoundRemoteData,
  $gameRemoteData,
  $roundResult,
  $gameState,
} from "@/lib/stores";
import { GameOverScoreboard } from "../card/PlinkoScoreboard";
import { parsePlinkoRoundNum } from "@/lib/parsePlinkoRoundNum";

/**
 *  Pre-round dialog
 * @returns
 */
export function PlinkoRoundWaitingToStartDialog() {
  const currentRoundData = useStore($currentRoundRemoteData);
  const gameState = useStore($gameState);
  const openDialog = gameState === "waiting_to_start";

  // change the round to in progress
  function startRound() {
    // $currentRoundState.set("in_progress");
    // $currentRoundState.setKey("state", "in_progress");
    $gameState.set("round_in_progress");
  }

  if (!currentRoundData) {
    return null;
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false}>
        <DialogHeader>
          <DialogTitle>
            Round {parsePlinkoRoundNum(currentRoundData.key)} is about to start!
          </DialogTitle>
          <DialogDescription>Get ready to drop your balls</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={startRound}>
            Start
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Post-round dialog
 */
export function PlinkoRoundEndedDialog() {
  const currentRoundData = useStore($currentRoundRemoteData);
  const nextRoundData = useStore($nextRoundRemoteData);
  const gameState = useStore($gameState);
  const openDialog = gameState === "round_ended";

  // change the round state to waiting to start
  function nextRound() {
    // reset the round result
    $roundResult.set(null);
    // set the current round to the next round
    $currentRoundRemoteData.set(nextRoundData);
    // reset the next round
    $nextRoundRemoteData.set(null);

    // if there is a next round...
    if (nextRoundData) {
      // set the game state
      $gameState.set("waiting_to_start");
    } else {
      // otherwise, the game is over.
      // We shouldn't actually ever get here, but just in case...
      $gameState.set("game_over");
    }
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false}>
        <DialogHeader>
          <DialogTitle>Round {currentRoundData?.key} has ended!</DialogTitle>
          <DialogDescription>
            Your score is {currentRoundData?.score}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={nextRound}>
            Next Round
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Game over dialog
 */
export function PlinkoGameOverDialog() {
  // const currentRoundData = useStore($currentRoundRemoteData);
  // const nextRoundData = useStore($nextRoundRemoteData);
  const gameState = useStore($gameState);
  const openDialog = gameState === "game_over";

  return (
    <Dialog open={openDialog}>
      <DialogContent dismissable={false}>
        <GameOverScoreboard />
        {/* <DialogHeader>
          <DialogTitle>
            Game over
          </DialogTitle>
          <DialogDescription>
            Your score is {currentRoundData?.score}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" onClick={nextRound}>
            Next Round
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
