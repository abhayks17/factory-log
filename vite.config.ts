import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import basicSsl from '@vitejs/plugin-basic-ssl';
import path from "path";

export default defineConfig({
    plugins: [
        basicSsl(),
        tailwindcss(),
        react(),
        VitePWA({
            registerType: "autoUpdate",
            includeAssets: ["favicon.ico", "icons/*.png"],
            manifest: {
                name: "FactoryLog",
                short_name: "FactoryLog",
                description: "Factory Tool Usage Logging System",
                theme_color: "#1e3a8a",
                background_color: "#f3f4f6",
                display: "standalone",
                orientation: "portrait",
                scope: "/",
                start_url: "/",
                icons: [
                    { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
                    { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
                    {
                        src: "/icons/icon-512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/.*\/api\/.*/i,
                        handler: "NetworkFirst",
                        options: {
                            cacheName: "api-cache",
                            networkTimeoutSeconds: 10,
                            cacheableResponse: { statuses: [0, 200] },
                        },
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        port: 5173,
        host: "0.0.0.0"
    },
});
