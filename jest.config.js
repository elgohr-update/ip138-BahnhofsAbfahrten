module.exports = {
  projects: ['test/client/jest.config.js', 'test/server/jest.config.js'],
  collectCoverage: !process.env.NO_COVERAGE,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coverageReporters: ['text-summary', 'lcov'],
  coverageDirectory: '<rootDir>/reports',
  reporters: ['default', 'jest-junit'],
};
