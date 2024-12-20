import { newPlinkoGame } from "@/lib/client/newPlinkoGame";
import { Button } from "../ui/button";
import { useState } from "react";

export function PlinkoNewGameButton() {
  const [isCreatingGame, setIsCreatingGame] = useState(false);

  function hanldeNewGame() {
    setIsCreatingGame(true);
    newPlinkoGame();
  }

  return (
    <Button type="button" onClick={hanldeNewGame}>
      {isCreatingGame ? "Creating game..." : "New game"}
    </Button>
  );
}
