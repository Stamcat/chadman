import type { CSSObject, ComponentThemeOverrides, SerializedStyles, RegisteredComponent, Theme } from "./types";
import { componentSelectors } from "./components";
import { cssObjectToCssText, toCSSObject } from "./utilities";

function buildRootStyle(root: Theme["root"]): string | undefined {
    if (!root) {
        return undefined;
    }

    if (typeof root === "string") {
        const value = root.trim();
        return value.includes("{") ? value : `:root { ${value} }`;
    }

    return cssObjectToCssText(":root", toCSSObject(root));
}

function buildComponentStyle(selector: string, styles: CSSObject | SerializedStyles | string): string {
    if (typeof styles === "string") {
        const value = styles.trim();
        return value.includes("{") ? value : `${selector} { ${value} }`;
    }

    return cssObjectToCssText(selector, toCSSObject(styles));
}

function buildComponentThemeOverrides(components?: ComponentThemeOverrides): string[] {
    return (Object.keys(componentSelectors) as RegisteredComponent[])
        .map((componentName) => {
            const styles = components?.[componentName];
            return styles ? buildComponentStyle(componentSelectors[componentName], styles) : undefined;
        })
        .filter((value): value is string => Boolean(value));
}

export type ThemeBuilderOptions = {
    /** Default: true. Set false only if _tokens.scss's chadman-base/-component/-theme layer order isn't loaded (see ThemeProviderProps.layered). */
    layered?: boolean;
};

export function themeBuilder(theme: Theme, options?: ThemeBuilderOptions): string {
    const rules = [
        cssObjectToCssText(":root", toCSSObject(theme.colors ?? {})),
        buildRootStyle(theme.root),
        ...buildComponentThemeOverrides(theme.components),
    ]
        .filter(Boolean)
        .join("\n");

    if (options?.layered === false) {
        return rules;
    }

    // Layer order is already declared once, globally, in _tokens.scss — this only needs to
    // place these rules into the chadman-theme layer, not redeclare the order.
    return `@layer chadman-theme {\n${rules}\n}`;
}
