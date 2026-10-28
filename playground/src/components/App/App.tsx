import { ThemeProvider } from "@stamcat/chadman/theme";
import { Button } from "@stamcat/chadman/Button";
import { Checkbox } from "@stamcat/chadman/Checkbox";

const tealTheme = {
    colors: {
        "--primary": "#068089",
        "--primary-foreground": "#ffffff",
        "--border": "#068089",
        "--ring": "#068089",
        "--radius": "0.5rem",
    },
    components: {
        button: `.button--outline { color: #068089; }`,
    },
};

export const App = () => {
    return (
        <ThemeProvider theme={tealTheme}>
            <main>
                <Button>Teal button</Button>
                <Checkbox id="teal-checkbox" />
            </main>
        </ThemeProvider>
    );
};
