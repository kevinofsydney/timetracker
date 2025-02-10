module.exports = {
  ...require('./jest.config'),
  testEnvironment: 'node',
  testMatch: ['**/__tests__/e2e/**/*.[jt]s?(x)'],
  setupFilesAfterEnv: [
    '<rootDir>/scripts/__tests__/helpers/setup.ts',
    '<rootDir>/scripts/__tests__/helpers/e2e-setup.ts',
  ],
  testTimeout: 30000,
  globalSetup: '<rootDir>/scripts/__tests__/helpers/global-setup.ts',
  globalTeardown: '<rootDir>/scripts/__tests__/helpers/global-teardown.ts',
  allowEmptyTestSuites: true,
} 