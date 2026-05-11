module.exports = {
    preset:"ts-jest",
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts"],
    clearMocks: true,
    globalSetup: "<rootDir>/tests/config/globalSetup.ts",
    globalTeardown: "<rootDir>/tests/config/globalTeardown.ts"
}