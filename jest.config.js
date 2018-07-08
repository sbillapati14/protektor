module.exports = {
  collectCoverage: !!process.env.WITH_COVERAGE,
  rootDir: process.cwd(),
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
  coverageThreshold: {
    global: {
      statements: 85,
      branches: 62,
      functions: 90,
      lines: 84
    }
  },
  testMatch: ['<rootDir>/spec/*.spec.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};
