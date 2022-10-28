import { defineConfig } from 'vitest/config'
import { Swc } from './vitest.swc'

export default defineConfig({
  test: {
    root: '.',
    globals: true,
    include: ['test/**/*.test.ts'],
    globalSetup: 'vitest.setup.ts',
    threads: false,
    watch: false,
    silent: true,
    logHeapUsage: true,
    passWithNoTests: true,
    coverage: {
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/4.main/**',
        'src/**/auth-middleware.ts',
        'src/**/data-sources/**',
        'src/**/persistence/**/entities/**',
        'src/**/persistence/**/migrations/**'
      ],
      provider: 'istanbul',
      reporter: ['text-summary', 'html', 'lcov'],
      statements: 100
    },
    deps: {
      inline: ['typeorm']
    }
  },
  resolve: {
    alias: {
      '@/core': 'src/core',
      '@/communication': 'src/modules/communication',
      '@/user': 'src/modules/user'
    }
  },
  esbuild: false,
  plugins: [
    Swc()
  ]
})
