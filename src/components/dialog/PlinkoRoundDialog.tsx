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
  $currentRoundState,
  $gameState,
  $nextRoundRemoteData,
  resetCurrentRoundToNext,
} from "@/lib/stores";

/**
 *  Pre-round dialog
 * @returns
 */
export function PlinkoRoundWaitingToStartDialog() {
  const currentRoundState = useStore($currentRoundState);
  const openDialog = currentRoundState.state === "waiting_to_start";

  // change the round to in progress
  function startRound() {
    // $currentRoundState.set("in_progress");
    $currentRoundState.setKey("state", "in_progress");
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Round {currentRoundState.remoteData?.key} is about to start!
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
  const currentRoundState = useStore($currentRoundState);
  const nextRoundRemoteData = useStore($nextRoundRemoteData);
  const openDialog = currentRoundState.state === "ended";

  // change the round state to waiting to start
  function nextRound() {
    // reset the current round to the next round
    resetCurrentRoundToNext(nextRoundRemoteData);

    // reload the page
    // location.reload();
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Round {currentRoundState.remoteData?.key} has ended!
          </DialogTitle>
          <DialogDescription>
            Your score is {currentRoundState.score}
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
