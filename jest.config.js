module.exports = {
    injectGlobals: false,
    testEnvironment: "node",
    // preset: "ts-jest/presets/default-esm",
    rootDir: "src",
    moduleNameMapper: {
        // necessary to make ESM modules work
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
        "^.+\\.m?[tj]s?$": ["@swc/jest"],
    },
    coverageDirectory: "../.coverage",
    collectCoverageFrom: [
        "src/**/*.ts",
        "src/**/*.mts",
        "!src/**/*.d.ts",
        "!src/**/*.d.mts",
    ],
}
