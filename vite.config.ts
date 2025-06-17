import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/ancient-history-trivia-pwa/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logos/logo_192.png', 'logos/logo_512.png', 'logos/logo_64.svg', 'logos/logo_128.svg'],
      manifest: {
        name: 'Ancient History Trivia',
        short_name: 'History Trivia',
        description: 'Test your knowledge of ancient civilizations and historical events',
        theme_color: '#6366F1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/ancient-history-trivia-pwa/',
        start_url: '/ancient-history-trivia-pwa/',
        categories: ['education', 'games', 'entertainment'],
        lang: 'en',
        icons: [
          {
            src: 'logos/logo_192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logos/logo_512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 3000000, // 3MB to handle large SVG files
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\//,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets',
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\//,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true,
    port: 3000
  }
})
