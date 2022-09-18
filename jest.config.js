module.exports = {
  roots: ['<rootDir>'],
  collectCoverage: false,
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/4.main/**'
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
  testTimeout: 10000
}
