module.exports = {
  collectCoverage: !!process.env.WITH_COVERAGE,
  rootDir: process.cwd(),
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx}'],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 32,
      functions: 75,
      lines: 75
    }
  },
  testMatch: ['<rootDir>/spec/*.spec.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  }
};
