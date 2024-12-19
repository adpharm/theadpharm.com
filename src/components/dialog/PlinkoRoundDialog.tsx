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
import { useEffect, useState, type ReactNode } from "react";
import { actions } from "astro:actions";
import { cn } from "@/lib/utils";
import { ChevronLeft, Lock } from "lucide-react";
import { makePrettyNumber } from "@/lib/utils.numbers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "../ui/separator";
import { plinkoSettings } from "@/lib/settings.plinko";
import { upgradeSettings } from "@/lib/settings.plinkoUpgrades";

type Tabs = "main" | "detail";

/**
 *  Pre-round dialog
 * @returns
 */
export function PlinkoRoundWaitingToStartDialog() {
  const [activeTab, setActiveTab] = useState<Tabs>("main");
  const currentRoundData = useStore($currentRoundRemoteData);
  const gameData = useStore($gameRemoteData);
  const gameState = useStore($gameState);
  const openDialog = gameState === "waiting_to_start" && !gameData?.game_over;
  const upgradeBudget = gameData?.upgrade_budget || 0;

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

  return (
    <Dialog open={openDialog}>
      {/* <!-- <DialogTrigger>Open</DialogTrigger> --> */}
      <DialogContent dismissable={false}>
        <DialogHeader>
          <DialogTitle>
            Round {parsePlinkoRoundNum(currentRoundData.key)} is about to start!
          </DialogTitle>
          {/* <DialogDescription>Get ready to drop your balls</DialogDescription> */}
        </DialogHeader>

        {/* upgrade board form */}
        {!currentRoundData.did_select_upgrade &&
        gameData?.current_round_key !== "rnd1" ? (
          <>
            <div>
              <p className="text-sm text-gray-500">Your upgrade budget:</p>
              <p className="text-2xl">${makePrettyNumber(upgradeBudget)}</p>
            </div>

            <Form {...form}>
              <form onSubmit={onSubmit} className="grid gap-8">
                <Tabs
                  value={activeTab}
                  onValueChange={(val) => setActiveTab(val as Tabs)}
                >
                  <TabsList className="sr-only">
                    <TabsTrigger value="main">Main</TabsTrigger>
                    <TabsTrigger value="detail">Detail</TabsTrigger>
                  </TabsList>

                  <TabsContent value="main">
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

                                // handle special cases separately
                                if (
                                  upgradeKey === "pocketValuePlus3000" ||
                                  upgradeKey === "pocketValuePlus6000" ||
                                  upgradeKey === "pocketValuePlus9000"
                                ) {
                                  setActiveTab("detail");
                                  return;
                                }

                                // otherwise, it's a boolean field
                                form.setValue(upgradeKey, true);
                              }}
                              defaultValue={field.value}
                              // className="flex flex-col space-y-1"
                              className="grid grid-cols-2 gap-4"
                            >
                              {Object.entries(upgradeSettings).map(
                                ([
                                  upgradeKey,
                                  { label, description, cost },
                                ]) => {
                                  return (
                                    <UpgradeRadioOption
                                      key={`radio-upgrade-${upgradeKey}`}
                                      label={label}
                                      description={description}
                                      value={upgradeKey}
                                      cost={cost}
                                      locked={upgradeBudget < cost}
                                    />
                                  );
                                },
                              )}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  {/************************************************************************
                  
                  Detail tabs (if needed)
                  
                  *************************************************************************/}
                  <TabsContent value="detail">
                    <Button
                      type="button"
                      variant={"secondary"}
                      // className="pl-0"
                      onClick={() => {
                        form.resetField("upgradeKey");
                        setActiveTab("main");
                      }}
                    >
                      <ChevronLeft className="size-4 -ml-1" />
                      <span>Back</span>
                    </Button>

                    <Separator className="my-4" />

                    {selectedUpgradeKey === "pocketValuePlus3000" ||
                    selectedUpgradeKey === "pocketValuePlus6000" ||
                    selectedUpgradeKey === "pocketValuePlus9000" ? (
                      <FormField
                        control={form.control}
                        name={selectedUpgradeKey}
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>
                              Select a pocket to add
                              <span className="text-green-400">
                                {selectedUpgradeKey === "pocketValuePlus3000"
                                  ? " 3000"
                                  : selectedUpgradeKey === "pocketValuePlus6000"
                                    ? " 6000"
                                    : " 9000"}{" "}
                              </span>
                              to
                            </FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={(val) => {
                                  const pocketKey = val as string;
                                  // set the value of the field
                                  field.onChange(pocketKey);
                                }}
                                defaultValue={field.value}
                                className="grid grid-cols-7 gap-1"
                              >
                                {plinkoSettings.pocketKeys.map((pocketKey) => {
                                  const pocketValue =
                                    currentRoundData[
                                      // TODO:NOTE: potentially dangerous type-casting
                                      `${pocketKey}_value` as "pocket_middle_value"
                                    ];

                                  return (
                                    <FormItem
                                      key={`pocket-${pocketKey}`}
                                      className={cn("relative pb-12")}
                                    >
                                      <FormLabel className="h-full flex flex-col border-2 border-transparent bg-transparent border-gray-700 rounded-lg p-1 pl-1.5 aspect-square has-[:checked]:border-white has-[:checked]:bg-gray-900">
                                        <div className="flex-1">
                                          <FormControl>
                                            <RadioGroupItem
                                              value={pocketKey}
                                              className=""
                                            />
                                          </FormControl>
                                        </div>

                                        <span className="block text-xs shrink-0">
                                          {makePrettyNumber(pocketValue)}
                                        </span>
                                      </FormLabel>
                                    </FormItem>
                                  );
                                })}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : null}
                  </TabsContent>
                </Tabs>

                {/***************************************************
                 *
                 * Submit
                 *
                 ****************************************************/}
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting || !selectedUpgradeKey}
                >
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
          </>
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
  description,
  cost,
  locked,
}: {
  label: ReactNode;
  value: string;
  description: string;
  cost: number;
  locked?: boolean;
}) {
  return (
    <FormItem
      aria-disabled={locked}
      className={cn(
        "relative h-full",
        locked ? "opacity-50 pointer-events-none" : "",
      )}
    >
      <FormLabel className="h-full block border-2 border-transparent bg-transparent border-gray-700 rounded-lg p-4 has-[:checked]:border-white has-[:checked]:bg-gray-900">
        <FormControl>
          {locked ? (
            <Lock className="absolute right-2 top-2 pointer-events-none size-4 text-gray-500" />
          ) : (
            <RadioGroupItem
              value={value}
              className="absolute right-2 top-2 pointer-events-none"
            />
          )}
        </FormControl>

        <span
          className={cn(
            "block pb-1.5 font-normal text-sm",
            locked ? "text-red-500" : "text-green-400",
          )}
        >
          ${makePrettyNumber(cost)}
        </span>
        <span className="block pb-1.5">{label}</span>
        <span className="block text-xs text-gray-500">{description}</span>
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
          <DialogTitle>
            Round {parsePlinkoRoundNum(currentRoundData?.key || "rnd1")} has
            ended!
          </DialogTitle>
          <DialogDescription>
            Your score is {makePrettyNumber(currentRoundData?.score || 0)}
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
        <GameOverScoreboard embeddedInDialog />
      </DialogContent>
    </Dialog>
  );
}
