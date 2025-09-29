/** @type {import('jest').Config} */
module.exports = {
  projects: [
    '<rootDir>/apps/web',
    '<rootDir>/packages/ui',
    '<rootDir>/packages/libs',
  ],
  collectCoverageFrom: [
    'apps/*/src/**/*.{js,jsx,ts,tsx}',
    'packages/*/src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  reporters: [
    'default',
    [
      'jest-stare',
      {
        resultDir: 'jest-stare',
        reportTitle: 'Web3 University Test Results',
        additionalResultsProcessors: [],
        coverageLink: './coverage/lcov-report/index.html',
      },
    ],
  ],
}
