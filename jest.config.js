module.exports = {
  roots: ['<rootDir>'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/4.main/**',
    '!<rootDir>/**/migrations/**',
    '!<rootDir>/**/data-sources/**',
    // remove after implementation:
    '!<rootDir>/**/*handler.ts',
    '!<rootDir>/**/mongodb-user.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  watchPathIgnorePatterns: [
    '<rootDir>/globalConfig',
    '<rootDir>/data-.*'
  ],
  transform: {
    '.+\\postgres.*entity.ts$': 'ts-jest',
    '.+\\.ts$': '@swc/jest'
  },
  testMatch: [
    '<rootDir>/test/**/*.test.ts'
  ],
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/communication/(.*)$': '<rootDir>/src/modules/communication/$1',
    '^@/user/(.*)$': '<rootDir>/src/modules/user/$1',
    '^~/(.*)$': '<rootDir>/test/$1'
  },
  testSequencer: '<rootDir>/jest-sequencer.js',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
