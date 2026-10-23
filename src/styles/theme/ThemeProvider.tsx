import { themeBuilder } from "./theme";
import { hashString } from "./utilities";
import type { ThemeProviderProps } from "./types";

export function ThemeProvider({
    theme,
    children,
    precedence = "high",
    href,
    layered = true,
}: ThemeProviderProps) {
    const themeStyles = themeBuilder(theme ?? {}, { layered });
    // React dedupes hoisted <style href> resources by href and never updates an already-mounted
    // one's content — so href must change whenever the generated CSS does, or switching `theme` at
    // runtime (e.g. a Storybook theme switcher) silently has no visible effect.
    const resolvedHref = href ?? `chadman-theme-provider-${hashString(themeStyles)}`;

    return (
        <>
            <style
                {...(precedence !== false ? { precedence, href: resolvedHref } : {})}
                dangerouslySetInnerHTML={{ __html: themeStyles }}
            />
            {children}
        </>
    );
}
