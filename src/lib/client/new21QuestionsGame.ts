import { actions } from "astro:actions";
import { logError } from "../utils.logger";
import { getPagePath } from "@nanostores/router";
import { $router } from "../stores/router";
import { toast } from "sonner";

/**
 * Starts a new 21 Questions game
 *
 * @returns
 */
export async function new21QuestionsGame() {
  try {
    const { data, error } = await actions.christmas21Questions.newGame();

    if (error) {
      logError("Error creating new 21 Questions game", error);
      toast.error(`Error creating new game: ${error.message}`);
      return;
    }

    // redirect to the game
    window.location.href = getPagePath($router, "games.21Questions");
  } catch (err) {
    logError("Error in new21QuestionsGame", err);
    toast.error("Could not start new game");
  }
}
