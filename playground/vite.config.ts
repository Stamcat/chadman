// Starting point only — once you have a real Figma Make kit, replace this with
// whatever vite.config.ts Figma Make actually generates for it (copy/paste from
// the kit's code view), so local behavior stays tuned to what Make produces.
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [react()],
    // @stamcat/chadman is consumed via a symlinked file: dependency pointing back at the repo root,
    // which has its own node_modules/react — dedupe forces both to resolve to playground's single copy.
    resolve: {
        dedupe: ["react", "react-dom"],
    },
    server: {
        port: 3000,
    },
});
