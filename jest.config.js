module.exports = {
  roots: ['<rootDir>'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/4.main/**'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  // testEnvironment: 'jest-environment-node',
  watchPathIgnorePatterns: ['globalConfig'],
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  },
  testMatch: ['**/*.unit.ts', '**/*.integration.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^~/(.*)$': '<rootDir>/tests/$1'
  }
}
