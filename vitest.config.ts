import { defineConfig } from 'vitest/config'

const path = '/core/3.infra/webapp/**'
const srcPath = 'src' + path
const testPath = 'test' + path

export default defineConfig({
  test: {
    root: '.',
    globals: true,
    include: ['test/**/*{integration,unit}.test.ts'],
    exclude: ['test/**/_doubles/**'],
    globalSetup: 'vitest.setup.ts',
    threads: false,
    watch: false,
    silent: true,
    logHeapUsage: false,
    passWithNoTests: true,
    coverage: {
      include: ['src/**/*.ts'],
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
      '~/core': 'test/core',
      '~/communication': 'test/modules/communication',
      '~/user': 'test/modules/user'
    }
  }
})
