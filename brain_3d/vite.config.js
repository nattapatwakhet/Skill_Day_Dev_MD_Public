import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // Current 3d-force-graph publishes a pre-bundled ESM artifact. It cannot be
    // split internally without forking upstream, so budget that vendor chunk
    // explicitly while keeping application code in its own small chunk.
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "vendor-three";
          if (id.includes("/node_modules/3d-force-graph/") || id.includes("/node_modules/three-forcegraph/") || id.includes("/node_modules/d3-")) {
            return "vendor-force-graph";
          }
        },
      },
    },
  },
});
