// stores/router.ts
import { createRouter } from "@nanostores/router";

export const $router = createRouter(
  {
    home: "/",
    login: "/login",
    register: "/register",
    about: "/about",
    clients: "/clients",
    services: "/services",
    contact: "/contact",
    "digital.home": "/digital",
    "synapse.home": "/synapse",
    "games.plinko.home": "/digital/plinko",
    "games.plinko.gameId": "/digital/plinko/:gameId",
    // "games.21Questions.gameId": "/digital/21Questions/:gameId",
    "games.21Questions": "/digital/21Questions",
  },
  {
    links: false,
  },
);
