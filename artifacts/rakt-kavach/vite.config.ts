import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT ?? 3000);
const base = process.env.BASE_PATH ?? "/";

export default defineConfig({
  root: projectRoot,
  base,
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/rakt-kavach-192.png", "icons/rakt-kavach-512.png"],
      manifest: {
        name: "Rakt Kavach (रक्त कवच)",
        short_name: "Rakt Kavach",
        description: "National Emergency Blood & Health Network",
        lang: "en-IN",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#050b18",
        theme_color: "#b20d1e",
        orientation: "portrait-primary",
        icons: [
          {
            src: "/icons/rakt-kavach-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "/icons/rakt-kavach-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          }
        ]
      },
      workbox: {
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api\//],
        globPatterns: ["**/*.{css,html,ico,js,png,svg,webmanifest,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(projectRoot, "src")
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    host: "0.0.0.0",
    port,
    strictPort: true,
    allowedHosts: true
  },
  preview: {
    host: "0.0.0.0",
    port,
    strictPort: true,
    allowedHosts: true
  },
  build: {
    outDir: path.resolve(projectRoot, "dist"),
    emptyOutDir: true
  }
});
