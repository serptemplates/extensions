import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./packages/app-core/src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@serp-extensions/app-core': path.resolve(__dirname, './packages/app-core/src'),
      '@serp-extensions/ui': path.resolve(__dirname, './packages/ui/src'),
    },
  },
});
