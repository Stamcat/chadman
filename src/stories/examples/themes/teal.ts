import type { Theme } from "@/styles/theme";

// Runtime theme example for ThemeProvider — re-skins Button to the teal palette/shape used by
// https://github.com/Stamcat/craftsman/tree/main/.storybook/themes/teal. `colors` overrides the
// shared design tokens (covers the default/secondary/outline variants' bg/fg/border for free);
// `components.button` is a raw CSS string for the hover/text states craftsman's theme also
// customizes per variant, which aren't exposed as standalone tokens.
const tealTheme: Theme = {
  colors: {
    "--primary": "#068089", // teal800
    "--primary-foreground": "#ffffff",
    "--secondary": "#837976", // gray600
    "--secondary-foreground": "#ffffff",
    "--border": "#068089", // teal800
    "--muted": "#f3f2f2", // gray150
    "--ring": "#068089", // teal800
    "--radius": "0.5rem", // 8px, matches craftsman's button border-radius
  },
  components: {
    button: `
      .button--default:hover { background: #06272d; }
      .button--outline { color: #068089; }
      .button--outline:hover { background: #f3f2f2; color: #068089; }
      .button--secondary:hover { background: #06272d; }
      .button--ghost { color: #068089; }
      .button--ghost:hover { background: #f3f2f2; color: #068089; }
      .button--link { color: #068089; }
    `,
  },
};

export { tealTheme };
