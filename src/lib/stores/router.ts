// stores/router.ts
import { createRouter } from "@nanostores/router";

export const $router = createRouter(
  {
    home: "/",
    login: "/login",
    register: "/register",
    "games.plinko.home": "/digital/plinko",
    "games.plinko.gameId": "/digital/plinko/:gameId",
  },
  {
    links: false,
  },
);
