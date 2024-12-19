import { $currentRoundRemoteData } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { useStore } from "@nanostores/react";
import { max } from "drizzle-orm";

export function PlinkoPocketValueGrid() {
  const currentRound = useStore($currentRoundRemoteData);

  return (
    <div className="grid grid-cols-7 text-center font-bold text-2xl bg-blue-900 pb-3 text-white">
      {[
        currentRound?.pocket_middle_left_3_value,
        currentRound?.pocket_middle_left_2_value,
        currentRound?.pocket_middle_left_1_value,
        currentRound?.pocket_middle_value,
        currentRound?.pocket_middle_right_1_value,
        currentRound?.pocket_middle_right_2_value,
        currentRound?.pocket_middle_right_3_value,
      ].map((pocketVal, idx) => {
        const pocketValStr = `${pocketVal}`;
        let pocketValByDigits = pocketValStr.split("");

        // if 5 digits or more, group first 2 digits
        if (pocketValStr.length > 4) {
          const firstTwoDigits = pocketValByDigits.slice(0, 2).join("");
          pocketValByDigits = [firstTwoDigits, ...pocketValByDigits.slice(2)];
        }

        // TODO: bad key
        return (
          <div key={`val-${idx}`} className="flex flex-col justify-center">
            {/* stack letters */}
            {pocketValByDigits.map((letter, letterIdx) => {
              return (
                <div
                  key={`val-${idx}-${letterIdx}`}
                  className={cn("-mb-2.5", letter.length > 1 ? "text-[90%]" : "")}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
