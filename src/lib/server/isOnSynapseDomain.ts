import type { AstroGlobal } from "astro";

export function isOnSynapseDomain(astro: Readonly<AstroGlobal>): boolean {
  const currentOrigin = astro.url.origin;

  // CHANGE THIS TO TRUE TO DEBUG SYNAPSE
  const debugSynapse = process.env.NODE_ENV === "development" && true;

  // if current origin includes synapsemedcom, then it's synapse
  if (currentOrigin.includes("synapsemedcom") || debugSynapse) {
    return true;
  }

  return false;
}
