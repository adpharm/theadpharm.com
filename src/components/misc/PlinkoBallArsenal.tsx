import { $remainingPlinkoBallsThisRound } from "@/lib/stores";
import { cn } from "@/lib/utils";
import { ClientOnly } from "@/lib/utils.react-hydration";
import { useStore } from "@nanostores/react";

export function PlinkoBallArsenal({
  showActive = true,
}: {
  showActive?: boolean;
}) {
  const plinkoBallsRemaining = useStore($remainingPlinkoBallsThisRound);

  return (
    <ClientOnly>
      {() => (
        <div className="grid grid-cols-10 gap-2">
          {plinkoBallsRemaining.map((ball, idx) => {
            return (
              <div
                // TODO: bad key
                key={`ball-${ball.key}`}
                className="aspect-square"
              >
                <div
                  className={cn(
                    "size-full bg-red-500 rounded-full border-2 border-transparent",
                    ball.powerUps.includes("golden") ? "bg-yellow-500" : "",
                    showActive && idx === 0 ? "border-white" : "",
                  )}
                ></div>
              </div>
            );
          })}
        </div>
      )}
    </ClientOnly>
  );
}
