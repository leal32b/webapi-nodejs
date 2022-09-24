module.exports = {
  roots: ['<rootDir>'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/4.main/**',
    '!<rootDir>/**/migrations/**'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  watchPathIgnorePatterns: [
    '<rootDir>/globalConfig',
    '<rootDir>/data-.*'
  ],
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: [
    '<rootDir>/test/**/*.test.ts'
  ],
  moduleNameMapper: {
    '^@/core/(.*)$': '<rootDir>/src/core/$1',
    '^@/communication/(.*)$': '<rootDir>/src/modules/communication/$1',
    '^@/user/(.*)$': '<rootDir>/src/modules/user/$1',
    '^~/(.*)$': '<rootDir>/test/$1'
  },
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  testTimeout: 10000
}
