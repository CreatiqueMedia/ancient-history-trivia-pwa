import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import viteImagemin from 'vite-plugin-imagemin'

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

  // Add image optimization for production builds only
  if (mode === 'production') {
    plugins.push(
      viteImagemin({
        // Image optimization configurations
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        mozjpeg: {
          quality: 80,
          progressive: true
        },
        webp: {
          quality: 80,
          lossless: false
        },
        svgo: {
          plugins: [
            { name: 'removeViewBox', active: false },
            { name: 'removeDimensions', active: true },
            { name: 'removeScriptElement', active: true },
            { name: 'removeStyleElement', active: true }
          ]
        }
      })
    );
  }

  return {
    base: '/', // Firebase Hosting uses root path
    plugins,
    resolve: {
      dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
      alias: {
        'react': 'react',
        'react-dom': 'react-dom',
        'react/jsx-runtime': 'react/jsx-runtime',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime'
      }
    },
    optimizeDeps: {
      force: true, // Force re-optimization
      include: [
        'react', 
        'react-dom', 
        'react/jsx-runtime',
        'react-router-dom',
        '@heroicons/react/24/outline',
        '@heroicons/react/24/solid',
        'clsx',
        'tailwind-merge'
      ],
      exclude: [
        // Lazy loaded modules
        'firebase/analytics',
        'firebase/performance',
        '@stripe/stripe-js',
        'firebaseui'
      ],
      esbuildOptions: {
        target: 'es2020',
        supported: {
          'top-level-await': true
        }
      }
    },
    define: {
      // Force single React instance in development
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      host: true,
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 3001,
      historyApiFallback: true,
      hmr: {
        port: parseInt(env.VITE_HMR_PORT) || 24678,
      },
      // Force full reload on context file changes to avoid Fast Refresh issues
      watch: {
        include: ['src/**/*'],
        ignored: ['**/node_modules/**', '**/dist/**'],
      }
    },
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      reportCompressedSize: false, // Disable for faster builds
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // React core libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            
            // UI and Icon libraries
            if (id.includes('@heroicons/react') || id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            
            // Firebase (split into separate chunks)
            if (id.includes('firebase/app') || id.includes('firebase/auth')) {
              return 'firebase-core';
            }
            if (id.includes('firebase/firestore') || id.includes('firebase/storage')) {
              return 'firebase-services';
            }
            if (id.includes('firebase/analytics') || id.includes('firebase/performance')) {
              return 'firebase-analytics';
            }
            
            // Payment processing
            if (id.includes('@stripe') || id.includes('stripe')) {
              return 'payment-vendor';
            }
            
            // Large utility libraries
            if (id.includes('dompurify') || id.includes('web-vitals')) {
              return 'utils-vendor';
            }
            
            // Node modules that aren't specifically chunked above
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
          chunkFileNames: (chunkInfo) => {
            if (chunkInfo.name.includes('vendor')) {
              return 'assets/vendor/[name]-[hash].js';
            }
            return 'assets/chunks/[name]-[hash].js';
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const extType = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${extType}`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${extType}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${extType}`;
            }
            return `assets/[name]-[hash].${extType}`;
          }
        },
        treeshake: {
          moduleSideEffects: false,
          unknownGlobalSideEffects: false
        }
      },
      chunkSizeWarningLimit: 1000, // Increase warning limit
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: true,
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : []
        },
        mangle: {
          safari10: true
        }
      },
      // Generate source maps for production debugging
      sourcemap: mode === 'production' ? 'hidden' : true
    }
  };
});
