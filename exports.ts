
export const EXPORTS = {
    Components: "components",
    Utilities: "utilities",
} as const;

export const PACKAGE_EXPORTS = {
    ".": {
        types: `./src/${EXPORTS.Components}/index.d.ts`,
        default: "./Components.esm.js",
    },
    [`./${EXPORTS.Utilities}`]: {
        types: `./src/${EXPORTS.Utilities}/index.d.ts`,
        default: "./Utilities.esm.js",
    },
    "./styles/tokens": {
        default: "./src/styles/_tokens.scss",
    },
} as const;

