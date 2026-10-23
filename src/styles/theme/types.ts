import type { ReactNode } from "react";
import type { componentSelectors } from "./components";

// Mirrors the CSS custom properties defined in src/styles/_tokens.scss — keep in sync with
// that file; TypeScript cannot derive this union from a Sass partial automatically.
export type TokenVariableName =
    | "--background"
    | "--foreground"
    | "--card"
    | "--card-foreground"
    | "--popover"
    | "--popover-foreground"
    | "--primary"
    | "--primary-foreground"
    | "--secondary"
    | "--secondary-foreground"
    | "--muted"
    | "--muted-foreground"
    | "--accent"
    | "--accent-foreground"
    | "--destructive"
    | "--border"
    | "--input"
    | "--ring"
    | "--chart-1"
    | "--chart-2"
    | "--chart-3"
    | "--chart-4"
    | "--chart-5"
    | "--radius"
    | "--radius-sm"
    | "--radius-md"
    | "--radius-lg"
    | "--radius-xl"
    | "--radius-2xl"
    | "--radius-3xl"
    | "--radius-4xl"
    | "--sidebar"
    | "--sidebar-foreground"
    | "--sidebar-primary"
    | "--sidebar-primary-foreground"
    | "--sidebar-accent"
    | "--sidebar-accent-foreground"
    | "--sidebar-border"
    | "--sidebar-ring"
    | "--font-sans"
    | "--font-heading";

export type CSSObject = {
    [key: string]: string | number | CSSObject | undefined;
};

export type SerializedStyles = {
    name: string;
    styles: string;
    next?: SerializedStyles;
};

export type RegisteredComponent = keyof typeof componentSelectors;

export type ComponentThemeOverrides = {
    [K in RegisteredComponent]?: CSSObject | SerializedStyles | string;
};

export type Colors = Partial<Record<TokenVariableName, string>>;

export type Theme = {
    /** Overrides design tokens (colors, radius, fonts) from src/styles/_tokens.scss. */
    colors?: Colors;
    /** Raw CSS (object, Emotion-style SerializedStyles, or string) written to :root, before `colors`. */
    root?: CSSObject | SerializedStyles | string;
    /** Per-component overrides, keyed by the component's registered name (see componentSelectors). */
    components?: ComponentThemeOverrides;
};

export type ThemeProviderProps = {
    theme?: Theme;
    children?: ReactNode;
    /** Default: "high". Set to false to opt out of React's style hoisting. */
    precedence?: string | false;
    href?: string;
    /**
     * Default: true. Writes overrides into the `chadman-theme` layer, which `_tokens.scss` already
     * declares as the highest-priority layer (after `chadman-base`/`chadman-component`) — so this
     * reliably wins regardless of load order, as long as `_tokens.scss` is imported (required anyway,
     * see setup.md). Set false only if `_tokens.scss` isn't loaded, in which case overrides are
     * written as plain unlayered CSS instead (relies on DOM/source order to win).
     */
    layered?: boolean;
};
