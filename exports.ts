
export const EXPORTS = {
    Components: "components",
    Styles: "styles",
} as const;

export const PACKAGE_EXPORTS = {
    ".": {
        types: `./src/${EXPORTS.Components}/index.d.ts`,
        default: "./Components.esm.js",
    },
    [`./${EXPORTS.Styles}/tokens`]: {
        default: `./src/${EXPORTS.Styles}/_tokens.scss`,
    },
} as const;

