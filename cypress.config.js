const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'apps/web/e2e/support/e2e.js',
    specPattern: 'apps/web/e2e/**/*.cy.{js,jsx,ts,tsx}',
    fixturesFolder: 'apps/web/e2e/fixtures',
    screenshotsFolder: 'apps/web/e2e/screenshots',
    videosFolder: 'apps/web/e2e/videos',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
      webpackConfig: {
        resolve: {
          alias: {
            '@': './apps/web/src',
          },
        },
      },
    },
    specPattern: 'apps/web/src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'apps/web/e2e/support/component.js',
  },
})
