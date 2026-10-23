import { themeBuilder } from "./theme";
import type { ThemeProviderProps } from "./types";

export function ThemeProvider({
    theme,
    children,
    precedence = "high",
    href = "chadman-theme-provider",
    layered = true,
}: ThemeProviderProps) {
    const themeStyles = themeBuilder(theme ?? {}, { layered });

    return (
        <>
            <style {...(precedence !== false ? { precedence, href } : {})} dangerouslySetInnerHTML={{ __html: themeStyles }} />
            {children}
        </>
    );
}
