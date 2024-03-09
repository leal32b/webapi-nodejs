import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    root: '.',
    globals: true,
    include: ['test/**/*.{integration,unit}-test.ts'],
    exclude: ['test/**/_doubles/**'],
    pool: 'vmThreads',
    watch: false,
    silent: true,
    logHeapUsage: false,
    passWithNoTests: true,
    coverage: {
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/4.main/**', 
        'src/**/data-sources/**', 
        'src/**/persistence/**/{entities,migrations}/**',
        'src/**/*.queue.ts',
      ],
      provider: 'istanbul',
      reporter: [
        'html',
        'lcov',
        'text-summary'
      ],
      thresholds: {
        statements: 100
      }
    },
  },
  plugins: [tsconfigPaths()]
})
