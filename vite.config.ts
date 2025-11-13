import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(async () => ({
    build: {
        target: 'modules',
    },
    server: {
        port: 5180
    }
}));
