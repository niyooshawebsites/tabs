// import { defineConfig, loadEnv } from 'vite';
// import react from '@vitejs/plugin-react';
// import jsconfigPaths from 'vite-jsconfig-paths';
// import path from 'path';

// export default defineConfig(({ mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');
//   const API_URL = env.VITE_APP_BASE_NAME || '/';
//   const PORT = 5173;

//   return {
//     base: API_URL,
//     server: {
//       open: true,
//       port: PORT,
//       host: true
//     },
//     preview: {
//       open: true,
//       host: true
//     },
//     define: {
//       global: 'window'
//     },
//     resolve: {
//       alias: {
//         '@ant-design/icons': path.resolve(__dirname, 'node_modules/@ant-design/icons')
//         // Add more aliases as needed
//       }
//     },
//     plugins: [react(), jsconfigPaths()],
//     build: {
//       chunkSizeWarningLimit: 1000,
//       sourcemap: true,
//       cssCodeSplit: true,
//       rollupOptions: {
//         output: {
//           chunkFileNames: 'js/[name]-[hash].js',
//           entryFileNames: 'js/[name]-[hash].js',
//           assetFileNames: (assetInfo) => {
//             const name = assetInfo.name || '';
//             const ext = name.split('.').pop();
//             if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
//             if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
//             if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;
//             return `assets/[name]-[hash].${ext}`;
//           }
//           // manualChunks: { ... } // Add if you want custom chunk splitting
//         }
//       },
//       // Only drop console/debugger in production
//       ...(mode === 'production' && {
//         esbuild: {
//           drop: ['console', 'debugger'],
//           pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
//         }
//       })
//       // No need to set build.target unless you need to support older browsers
//       // target: 'baseline-widely-available', // This is now the default
//     },
//     optimizeDeps: {
//       include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
//     }
//   };
// });

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/';
  const PORT = 5173;

  return {
    base: API_URL,

    server: {
      host: true,
      port: PORT,
      strictPort: true,
      open: false,
      watch: {
        usePolling: true
      },

      // 🔥 Allow tenant123.localhost, tenant22.localhost, etc.
      allowedHosts: ['.localhost'],

      // 🔥 Proxy API to backend container
      proxy: {
        '/api': {
          target: 'http://server:8800', // Docker service name
          changeOrigin: false, // VERY IMPORTANT for multi-tenant
          secure: false
        }
      }
    },

    preview: {
      host: true,
      port: PORT,
      open: false
    },

    define: {
      global: 'window'
    },

    resolve: {
      alias: {
        '@ant-design/icons': path.resolve(__dirname, 'node_modules/@ant-design/icons')
      }
    },

    plugins: [react(), jsconfigPaths()],

    build: {
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
      cssCodeSplit: true,

      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const name = assetInfo.name || '';
            const ext = name.split('.').pop();

            if (/\.css$/.test(name)) return `css/[name]-[hash].${ext}`;
            if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(name)) return `images/[name]-[hash].${ext}`;
            if (/\.(woff2?|eot|ttf|otf)$/.test(name)) return `fonts/[name]-[hash].${ext}`;

            return `assets/[name]-[hash].${ext}`;
          }
        }
      },

      ...(mode === 'production' && {
        esbuild: {
          drop: ['console', 'debugger'],
          pure: ['console.log', 'console.info', 'console.debug', 'console.warn']
        }
      })
    },

    optimizeDeps: {
      include: ['@mui/material/Tooltip', 'react', 'react-dom', 'react-router-dom']
    }
  };
});
