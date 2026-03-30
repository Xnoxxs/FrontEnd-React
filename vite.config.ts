/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { analyzer } from 'vite-bundle-analyzer'

const analyze = process.env.ANALYZE === 'true'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    react(),
    ...(analyze
      ? [
          analyzer({
            analyzerMode: 'static',
            openAnalyzer: false,
            fileName: 'bundle-report',
            reportTitle: 'react-app — Vite bundle',
          }),
        ]
      : []),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    exclude: [
      '**/node_modules/**',
      '**/.git/**',
      '**/dist/**',
      '**/.next/**',
      '**/e2e/**',
    ],
  },
})
