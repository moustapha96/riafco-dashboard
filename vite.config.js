/* eslint-disable no-dupe-keys */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa';

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: "autoUpdate",
            devOptions: {
                enabled: !isProd,
            },
            includeAssets: [
                "favicon.svg",
                "apple-touch-icon.png",
                "robots.txt",
                "logo-color.svg",
                "logo.png"
            ],
            workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}"],
                runtimeCaching: [{
                        urlPattern: /^https:\/\/www\.riafco\.org\/.*\.(png|jpg|jpeg|svg|webp|ico|woff2?)$/i,
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "riafco-image-assets",
                            expiration: {
                                maxEntries: 60,
                                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
                            },
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
                        handler: "StaleWhileRevalidate",
                        options: {
                            cacheName: "google-fonts-stylesheets",
                        },
                    },
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com/,
                        handler: "CacheFirst",
                        options: {
                            cacheName: "google-fonts-webfonts",
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
                            },
                        },
                    },
                ],
                navigateFallback: "/index.html",
                maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
            },
            manifest: {
                name: "RIAFCO",
                short_name: "RIAFCO",
                description: "Plateforme dynamique de RIAFCO",
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "portrait",
                background_color: "#ffffff",
                theme_color: "#0A2642",
                icons: [{
                        src: "/logo-200x200.png",
                        sizes: "200x200",
                        type: "image/png",
                        purpose: "any maskable"
                    },
                    {
                        src: "/logo-500x500.png",
                        sizes: "500x500",
                        type: "image/png",
                        purpose: "any maskable"
                    }
                ]
            }
        })
    ],
    define: {
        global: 'window'
    },
    optimizeDeps: {
        exclude: [
            '@fullcalendar/core',
            '@fullcalendar/daygrid',
            '@fullcalendar/timegrid',
            '@fullcalendar/react',
        ],
        esbuildOptions: {
            plugins: [
                NodeGlobalsPolyfillPlugin({
                    process: true,
                    buffer: true
                })
            ]
        }
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    build: {
        outDir: "../build/", // dossier de build spécifique à RIAFCO
        assetsDir: "assets",
        emptyOutDir: true,
        sourcemap: !isProd,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom", "react-router-dom"],
                    ui: ["antd"],
                },
            },
        },
        minify: "terser",
        terserOptions: {
            compress: {
                drop_console: isProd,
            },
        },
        chunkSizeWarningLimit: 1000,
    },
    server: {
        host: true,
        port: 3000,
        open: true,
        proxy: {
            '/api': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
            '/profiles': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },

            '/activities': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/countries': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/events': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/gouvernance': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/history': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/news': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/partners': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/resources': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/settings': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/teams': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/flags': {
                    target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/reports': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            },
            '/about-us': {
                target: 'https://back.riafco-oi.org',
                changeOrigin: true,
                secure: false,
            }
        },
    },
});