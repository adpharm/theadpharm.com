import { useStore } from "@nanostores/react";
import { Progress } from "../ui/progress";
import { $gameRemoteData } from "@/lib/stores";
import { parsePlinkoRoundNum } from "@/lib/parsePlinkoRoundNum";

export function PlinkoRoundProgressBar() {
  const gameData = useStore($gameRemoteData);
  const numRounds = 10;

  if (!gameData) {
    return null;
  }

  const percentage =
    (parsePlinkoRoundNum(gameData.current_round_key) / numRounds) * 100;

  return (
    <div className="relative">
      <Progress value={percentage} />
    </div>
  );
}
