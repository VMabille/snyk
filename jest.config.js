module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {}, // ignore .babelrc file
  collectCoverage: false, // not collecting coverage for now
  collectCoverageFrom: ['src/**/*.ts'],
  coverageReporters: ['text-summary', 'html'],
  testMatch: [
    '**/*.spec.ts', // Remove when all tests are using Jest
    '<rootDir>/test/*.spec.ts',
    '<rootDir>\\test\\*.spec.ts', // for Windows
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/test/.*fixtures',
    '<rootDir>/test/acceptance/*',
    '<rootDir>/test/acceptance/workspaces/*' // to avoid `jest-haste-map: Haste module naming collision` errors
  ],
};
