import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";

function crossOriginIsolationMiddleware(_, response, next) {
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  response.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
}

const crossOriginIsolation = {
  name: "cross-origin-isolation",
  configureServer: server => {
    server.middlewares.use(crossOriginIsolationMiddleware);
  },
  configurePreviewServer: server => {
    server.middlewares.use(crossOriginIsolationMiddleware);
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  vite: {
    plugins: [crossOriginIsolation],
    optimizeDeps: {
      exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util"],
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
    },
  },
});
