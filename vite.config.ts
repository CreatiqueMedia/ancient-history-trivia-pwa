import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Vite mode:', mode)
  console.log('Environment variables loaded:', Object.keys(env).filter(key => key.startsWith('VITE_')))
  // Using Firebase Hosting only - simplified configuration
  const plugins = [react()];
  
  // Add PWA plugin for production builds
  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logos/logo_64.svg', 'logos/logo_128.svg', 'logos/logo_192.svg'],
      manifest: {
        name: 'Ancient History Trivia',
        short_name: 'History Trivia',
        description: 'Test your knowledge of ancient civilizations and historical events',
        theme_color: '#6366F1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['education', 'games', 'entertainment'],
        lang: 'en',
        icons: [
          {
            src: 'logos/logo_192.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 5000000, // 5MB to handle large SVG files
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
  );

  return {
    base: '/', // Firebase Hosting uses root path
    plugins,
    server: {
      host: true,
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 3001,
      historyApiFallback: true
    }
  };
});
