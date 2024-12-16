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

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Round {currentRoundData?.key} is about to start!
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
    // reset the current round to the next round
    // resetCurrentRoundToNext(nextRoundRemoteData);
    $roundResult.set(null);
    $gameState.set("waiting_to_start");

    // const nextRound = $nextRoundRemoteData.get();

    // if there is a next round, set the current round to the next round
    if (nextRoundData) {
      $currentRoundRemoteData.set(nextRoundData);
      $nextRoundRemoteData.set(null);
    } else {
      // otherwise, the game is over.
    }

    // reload the page
    // location.reload();
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
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
