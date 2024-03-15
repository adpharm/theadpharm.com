/// <reference types="astro/client" />

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
