import { $settingUpGame } from "@/lib/stores";
import { useStore } from "@nanostores/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export function PlinkoLoadingScreen() {
  const settingUpGame = useStore($settingUpGame);

  if (!settingUpGame) return null;

  return (
    <div className="fixed inset-0 z-60 flex flex-col items-center justify-center bg-sky-100 font-xmas">
      <h1 className="text-2xl">We're getting your game ready...</h1>

      <div className="size-96">
        <DotLottieReact
          src="/plinko/lottie/SantaLoading.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}
