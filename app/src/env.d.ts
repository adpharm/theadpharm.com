/// <reference types="astro/client" />

export {};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}
