import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    return {
        plugins: [react()],
        base: "/", // Assuming the app is hosted at the root
        define: {
            "process.env": env,
        },
        build: {
            rollupOptions: {
                output: {
                    entryFileNames: `assets/[name].[hash].js`,
                    chunkFileNames: `assets/[name].[hash].js`,
                    assetFileNames: `assets/[name].[hash].[ext]`,
                },
            },
            outDir: "dist", // Ensure the build output goes to the "dist" directory
        },
        server: {
            host: true,
            port: 5173,
            historyApiFallback: true,
        },
        resolve: {
            alias: {
                "@": resolve(__dirname, "src"),
            },
        },
    };
});
