const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "e2e/support/e2e.js",
    specPattern: "e2e/**/*.cy.{js,jsx,ts,tsx}",
    fixturesFolder: "e2e/fixtures",
    screenshotsFolder: "e2e/screenshots",
    videosFolder: "e2e/videos",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
      webpackConfig: {
        resolve: {
          alias: {
            "@": "./src",
          },
        },
      },
    },
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "e2e/support/component.js",
  },
});
