import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  accountId: "c9bf3d8e875ffe933a9bf895695e0fd1", // Datum Labs
  worker: defineWorker({
    name: "datumlabs-aavev3dashboard",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-05",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      // Plain (non-secret) settings. Secrets (THEGRAPH key, BEEHIIV_*, SETNEL_*) are set
      // as Worker secrets, not here.
      NEXT_PUBLIC_AAVE_API_URL: bindings.text("https://api.v3.aave.com/graphql"),
      THEGRAPH_SUBGRAPH_URL: bindings.text(
        "https://gateway.thegraph.com/api/subgraphs/id/JCNWRypm7FYwV8fx5HhzZPSFaMxgkPuw4TnR3Gpi81zk",
      ),
      CACHE_TTL_MARKETS: bindings.text("60"),
      CACHE_TTL_WALLETS: bindings.text("120"),
      CACHE_TTL_OVERVIEW: bindings.text("300"),
      CACHE_TTL_LIQUIDATIONS: bindings.text("300"),
    },
  }),
});
