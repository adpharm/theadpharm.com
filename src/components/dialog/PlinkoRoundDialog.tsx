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
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  $remainingPlinkoBallsThisRound,
} from "@/lib/stores";
import { GameOverScoreboard } from "../card/PlinkoScoreboard";
import { parsePlinkoRoundNum } from "@/lib/parsePlinkoRoundNum";
import { useForm, type Control } from "react-hook-form";
import { z } from "astro:schema";
import {
  upgradePlinkoGameKeys,
  upgradePlinkoGameSchema,
} from "@/lib/zod.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { tablePlinkoGames } from "@/db/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { log, logDebug, logError } from "@/lib/utils.logger";
import { useEffect, type ReactNode } from "react";
import { actions } from "astro:actions";

const upgradesByRound: Record<
  (typeof tablePlinkoGames.current_round_key.enumValues)[number],
  // keys of the upgrade schema
  (typeof upgradePlinkoGameKeys)[number][]
> = {
  rnd1: [],
  rnd2: ["add1Ball", "makeRandomBallGolden"],
  rnd3: ["add1Ball", "makeRandomBallGolden"],
  rnd4: ["add1Ball", "makeRandomBallGolden"],
  rnd5: ["add1Ball", "makeRandomBallGolden"],
  rnd6: ["add1Ball", "makeRandomBallGolden"],
  rnd7: [],
  rnd8: [],
  rnd9: [],
  rnd10: [],
};

const upgradeKeyLabels: Record<(typeof upgradePlinkoGameKeys)[number], string> =
  {
    add1Ball: "Add 1 ball",
    makeRandomBallGolden: "Make a ball golden (randomly chosen)",
  };

/**
 *  Pre-round dialog
 * @returns
 */
export function PlinkoRoundWaitingToStartDialog() {
  const currentRoundData = useStore($currentRoundRemoteData);
  const gameData = useStore($gameRemoteData);
  const gameState = useStore($gameState);
  const openDialog = gameState === "waiting_to_start" && !gameData?.game_over;

  const form = useForm<z.infer<typeof upgradePlinkoGameSchema>>({
    resolver: zodResolver(upgradePlinkoGameSchema),
  });

  const [selectedUpgradeKey] = form.watch(["upgradeKey"]);

  // upgrade the board
  const onSubmit = form.handleSubmit(
    async (inputData) => {
      const { data, error } =
        await actions.plinko.updateBoardWithUpgrade(inputData);
      if (error) {
        return form.setError("root", { message: error.message });
      }

      // reset the current round data with the updated data
      $currentRoundRemoteData.set(data);

      // start the round
      startRound();

      // reset the form
      form.reset();
    },
    (err) => logError("RHF error", err),
  );

  // change the round to in progress
  function startRound() {
    $gameState.set("round_in_progress");
  }

  // useEffect to set the roundData to the form
  useEffect(() => {
    logDebug("useEffect to set the roundData to the form");
    if (currentRoundData) {
      form.setValue("roundData", currentRoundData);
    }
  }, [currentRoundData]);

  if (!currentRoundData) {
    return null;
  }

  let upgradesForThisRound = upgradesByRound[currentRoundData.key];

  // if we've already upgraded the board, don't show the form
  if (currentRoundData.upgraded) {
    upgradesForThisRound = [];
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

        {/* upgrade board form */}
        {upgradesForThisRound.length > 0 ? (
          <Form {...form}>
            <form onSubmit={onSubmit} className="grid gap-8">
              {/***************************************************
               * Upgrade options
               ****************************************************/}
              <FormField
                control={form.control}
                name="upgradeKey"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Select an upgrade</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(val) => {
                          const upgradeKey =
                            val as (typeof upgradePlinkoGameKeys)[number];
                          // set the value of the field
                          field.onChange(upgradeKey);

                          // handle when the add1Ball upgrade is selected
                          if (upgradeKey === "add1Ball") {
                            form.setValue("add1Ball", true);
                            return;
                          }

                          // handle when the makeRandomBallGolden upgrade is selected
                          if (upgradeKey === "makeRandomBallGolden") {
                            form.setValue("makeRandomBallGolden", true);
                            return;
                          }
                        }}
                        defaultValue={field.value}
                        // className="flex flex-col space-y-1"
                        className="grid grid-cols-2 gap-4"
                      >
                        {upgradesForThisRound.map((upgradeKey) => {
                          return (
                            <UpgradeRadioOption
                              key={`radio-upgrade-${upgradeKey}`}
                              label={upgradeKeyLabels[upgradeKey]}
                              value={upgradeKey}
                            />
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/***************************************************
               *
               * Submit
               *
               ****************************************************/}
              <Button type="submit">
                {form.formState.isSubmitting
                  ? "Submitting..."
                  : "Start next round"}
              </Button>

              {form.formState.errors.root && (
                <div className="text-red-500 dark:text-red-300">
                  {form.formState.errors.root.message}
                </div>
              )}
            </form>
          </Form>
        ) : (
          <div className="grid">
            <Button type="button" onClick={startRound}>
              Start Round
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function UpgradeRadioOption({
  label,
  value,
}: {
  label: ReactNode;
  value: string;
}) {
  return (
    <FormItem>
      <FormLabel className="block border border-gray-700 rounded-lg p-4 has-[:checked]:border-blue-500 has-[:checked]:text-blue-500">
        <FormControl>
          <RadioGroupItem
            value={value}
            className="absolute left-0 top-0 opacity-0 pointer-events-none"
          />
        </FormControl>

        <span>{label}</span>
      </FormLabel>
    </FormItem>
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
