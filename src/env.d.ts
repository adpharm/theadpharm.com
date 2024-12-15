/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type { tableSessions, tableUsers } from "./db/schema";

export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }

  namespace App {
    interface Locals {
      user: typeof tableUsers.$inferSelect | null;
      session: typeof tableSessions.$inferSelect | null;
      // session: import("./lib/server/session").Session | null;
    }
  }
}
