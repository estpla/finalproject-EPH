module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/unit/**/*.test.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["json-summary", "text"],
  collectCoverageFrom: ["src/**/*.js", "!src/prisma/seed.js", "!src/index.js"],
  setupFilesAfterEnv: ["./tests/setup.js"],
};
