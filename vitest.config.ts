import { defineConfig } from 'vitest/config'
import { Swc } from './vitest.swc'

export default defineConfig({
  test: {
    root: '.',
    globals: true,
    include: ['test2/**/*.test.ts'],
    exclude: [
      // 'test2/core/3.infra/persistence/**/*.test.ts',
      'test2/core/3.infra/validators/**/*.test.ts',
      'test2/modules/user/1.application/use-cases/**/*.test.ts',
      // 'test2/modules/user/3.infra/**/*.test.ts',
    ],
    globalSetup: 'vitest.setup.ts',
    silent: true,
    logHeapUsage: true,
    coverage: {
      provider: 'istanbul'
    },
    deps: {
      inline: ["typeorm"]
    }
  },
  resolve: {
    alias: {
      '@/core': 'src/core',
      '@/communication': 'src/modules/communication',
      '@/user': 'src/modules/user'
    },
  },
  esbuild: false,
  plugins: [
    Swc()
  ],
})