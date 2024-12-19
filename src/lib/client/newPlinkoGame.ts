import { actions } from "astro:actions";
import { logError } from "../utils.logger";
import { getPagePath } from "@nanostores/router";
import { $router } from "../stores/router";

/**
 * Play again
 *
 * @returns
 */
export async function newPlinkoGame() {
  const { data, error } = await actions.plinko.newGame();
  if (error) {
    logError("Error creating new game", error);
    return;
  }

  // redirect to the new game
  window.location.href = getPagePath($router, "games.plinko.gameId", {
    gameId: data.game.id,
  });
}
