// stores/router.ts
import { createRouter } from "@nanostores/router";

export const $router = createRouter(
  {
    home: "/",
    login: "/login",
    // list: "/posts/:category",
    // post: "/posts/:category/:post",
    "plinko.home": "/digital/plinko",
    "plinko.game.gameId": "/digital/plinko/:gameId",
  },
  {
    links: false,
  },
);
