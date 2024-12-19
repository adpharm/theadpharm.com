import { actions } from "astro:actions";
import { logError } from "../utils.logger";
import { getPagePath } from "@nanostores/router";
import { $router } from "../stores/router";

/**
 * Play again
 *
 * @returns
 */
export async function logout() {
  const { data, error } = await actions.user.signoutUser();

  if (error) {
    logError("Error logging out", error);
    return;
  }

  // redirect to the plinko home
  window.location.href = getPagePath($router, "games.plinko.home");
}
