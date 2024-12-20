import {
  $remainingPlinkoBallsThisRound,
  type PlinkoBallData,
} from "@/lib/stores";
import { cn } from "@/lib/utils";
import { ClientOnly } from "@/lib/utils.react-hydration";
import { useStore } from "@nanostores/react";

export function PlinkoBallArsenal({
  className,
  showActive = true,
  showNumbers = false,
}: {
  className?: string;
  showActive?: boolean;
  showNumbers?: boolean;
}) {
  const plinkoBallsRemaining = useStore($remainingPlinkoBallsThisRound);

  return (
    <ClientOnly>
      {() => (
        <div className={cn("grid grid-cols-10 gap-2", className)}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((ballIdx) => {
            let maybeBall: PlinkoBallData | null = null;
            try {
              maybeBall = plinkoBallsRemaining[ballIdx];
            } catch (e) {
              // do nothing
            }
            const isGolden = maybeBall?.powerUps.includes("golden");

            return (
              <div key={`ball-${ballIdx}`} className="relative aspect-square">
                {maybeBall ? (
                  <>
                    <img
                      src={
                        isGolden
                          ? "/plinko/other/GoldOrnamentPlinko@Lg.webp"
                          : "/plinko/other/RedOrnamentPlinko@Lg.webp"
                      }
                      className={cn(
                        "object-contain size-full rounded-full",
                        showActive && ballIdx === 0
                          ? "border-2 border-white"
                          : "",
                      )}
                    />

                    {!showActive && showNumbers && (
                      // only show the number if not showing active and showNumbers is true
                      <span
                        className={cn(
                          "absolute inset-0 pt-2 flex items-center justify-center font-bold",
                          isGolden ? "text-yellow-900" : "text-red-100",
                        )}
                      >
                        {ballIdx + 1}
                      </span>
                    )}
                  </>
                ) : (
                  // show placeholder
                  <img
                    src={"/plinko/other/BlackOrnamentPlinko@Lg.webp"}
                    className={"object-contain size-full opacity-30"}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </ClientOnly>
  );
}
