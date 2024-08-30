import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ""); // Loads environment variables directly

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
    },
    server: {
      host: true, // This allows the server to be accessible over the network
      port: 3000, // Adjust the port as necessary
      historyApiFallback: true, // Ensures that the index.html is served for all routes
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
