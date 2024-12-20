import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import inoxToolsRequestNanostores from "@inox-tools/request-nanostores";
// import sentry from "@sentry/astro";
import { config } from "dotenv";
config({ path: ".env" }); // or .env.local

// https://astro.build/config
export default defineConfig({
  server: {
    // required to work in a devcontainer
    host: "0.0.0.0",
    port: 3000,
  },

  output: "server",

  integrations: [
    tailwind({
      // To prevent serving the Tailwind base styles twice
      applyBaseStyles: false,
    }),
    react(),
    inoxToolsRequestNanostores(),
    // sentry({
    //   dsn: process.env.SENTRY_DSN,
    //   sourceMapsUploadOptions: {
    //     project: "theadpharm-com",
    //     authToken: process.env.SENTRY_AUTH_TOKEN,
    //   },
    // }),
  ],

  adapter: vercel(),
});
