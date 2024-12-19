import { $currentRoundRemoteData } from "@/lib/stores";
import { useStore } from "@nanostores/react";

export function PlinkoPocketValueGrid() {
  const currentRound = useStore($currentRoundRemoteData);

  return (
    <div className="grid grid-cols-7 text-center">
      <div>{currentRound?.pocket_middle_left_3_value}</div>
      <div>{currentRound?.pocket_middle_left_2_value}</div>
      <div>{currentRound?.pocket_middle_left_1_value}</div>
      <div>{currentRound?.pocket_middle_value}</div>
      <div>{currentRound?.pocket_middle_right_1_value}</div>
      <div>{currentRound?.pocket_middle_right_2_value}</div>
      <div>{currentRound?.pocket_middle_right_3_value}</div>
    </div>
  );
}
