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
  $currentRoundDatabaseSettings,
  $currentRoundLocalSettings,
} from "@/lib/stores";

/**
 *  Pre-round dialog
 * @returns
 */
export function PlinkoRoundWaitingToStartDialog() {
  const currentRoundDatabaseSettings = useStore($currentRoundDatabaseSettings);
  const currentRoundLocalSettings = useStore($currentRoundLocalSettings);
  const openDialog = currentRoundLocalSettings.state === "waiting_to_start";

  // change the round to in progress
  function startRound() {
    // $currentRoundState.set("in_progress");
    $currentRoundLocalSettings.setKey("state", "in_progress");
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Round {currentRoundDatabaseSettings.key} is about to start!
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
  const currentRoundDatabaseSettings = useStore($currentRoundDatabaseSettings);
  const currentRoundLocalSettings = useStore($currentRoundLocalSettings);
  const openDialog = currentRoundLocalSettings.state === "ended";

  // change the round state to waiting to start
  function nextRound() {
    // $currentRoundState.set("waiting_to_start");
    $currentRoundLocalSettings.setKey("state", "waiting_to_start");

    // reload the page
    location.reload();
  }

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Round {currentRoundDatabaseSettings.key} has ended!
          </DialogTitle>
          <DialogDescription>
            Your score is {currentRoundLocalSettings.score}
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
