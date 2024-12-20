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
    // TODO: sentry not working with Astro, I get:
    /**
     * 18:47:53 [ERROR] file:///var/task/dist/server/chunks/actions.rateLimit_Way2zPWH.mjs:5
        import { eq } from 'drizzle-orm';
                ^^
        SyntaxError: The requested module 'drizzle-orm' does not provide an export named 'eq'
            at ModuleJob._instantiate (node:internal/modules/esm/module_job:123:21)
            at async ModuleJob.run (node:internal/modules/esm/module_job:191:5)
            at async ModuleLoader.import (node:internal/modules/esm/loader:337:24)
            at async AppPipeline.getMiddleware (file:///var/task/dist/server/chunks/entrypoint_Bx66xfAD.mjs:236:34)
            at async RenderContext.create (file:///var/task/dist/server/chunks/index_BjTFwzRP.mjs:1237:32)
            at async NodeApp.render (file:///var/task/dist/server/chunks/entrypoint_Bx66xfAD.mjs:724:29)
            at async Server.handler (file:///var/task/dist/server/chunks/entrypoint_Bx66xfAD.mjs:1104:29)
            at async Server.<anonymous> (/opt/rust/nodejs.js:9:6760)
     * 
     */
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
