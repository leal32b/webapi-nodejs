import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    root: '.',
    globals: true,
    include: ['test/**'],
    exclude: ['test/**/_doubles/**'],
    globalSetup: 'vitest.setup.ts',
    threads: false,
    watch: false,
    silent: true,
    logHeapUsage: false,
    passWithNoTests: true,
    coverage: {
      include: ['src/**'],
      exclude: [
        'src/**/4.main/**', 
        'src/**/data-sources/**', 
        'src/**/persistence/**/{entities,migration}/**'
      ],
      provider: 'istanbul',
      reporter: ['text-summary', 'html', 'lcov'],
      statements: 100
    },
  },
  resolve: {
    alias: {
      '@/core': 'src/core',
      '@/communication': 'src/modules/communication',
      '@/user': 'src/modules/user',
      '~/core': 'test/core/_doubles',
      '~/communication': 'test/modules/communication/_doubles',
      '~/user': 'test/modules/user/_doubles'
    }
  }
})
