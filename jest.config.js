module.exports = {
  roots: ['<rootDir>'],
  testMatch: [
    '<rootDir>/test/**/*.test.ts'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>/globalConfig',
    '<rootDir>/data-.*'
  ],
  transform: {
    '.+\\postgres.*entity.ts$': 'ts-jest',
    '.+\\.ts$': '@swc/jest'
  },
  preset: '@shelf/jest-mongodb',
  testSequencer: '<rootDir>/jest-sequencer.js',
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/communication/(.*)$': '<rootDir>/src/modules/communication/$1',
    '^@/user/(.*)$': '<rootDir>/src/modules/user/$1'
  },
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/4.main/**',
    '!<rootDir>/**/migrations/**',
    '!<rootDir>/**/data-sources/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100
    }
  }
}
