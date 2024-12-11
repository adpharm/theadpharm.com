import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  server: {
    // required to work in a devcontainer
    host: "0.0.0.0",
    port: 3000,
  },
  output: "server",
  integrations: [tailwind(), react()],
  adapter: vercel(),
});
