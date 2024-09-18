import { defineConfig, loadEnv, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/", // Assuming the app is hosted at the root
    define: {
      "process.env": env,
      // Explicitly define Auth0 variables
      "import.meta.env.VITE_AUTH0_DOMAIN": JSON.stringify(env.VITE_AUTH0_DOMAIN),
      "import.meta.env.VITE_AUTH0_CLIENT_ID": JSON.stringify(env.VITE_AUTH0_CLIENT_ID),
      "import.meta.env.VITE_AUTH0_AUDIENCE": JSON.stringify(env.VITE_AUTH0_AUDIENCE),
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks(id) {
            // Example for vendor chunking
            if (id.includes("node_modules")) {
              return id.toString().split("node_modules/")[1].split("/")[0].toString();
            }
          },
        },
      },
      outDir: "dist", 
      chunkSizeWarningLimit: 1000, // Set to 1 MB (optional, adjust to suppress warnings)
    },
    server: {
      host: "0.0.0.0", // Allow connections from all hosts
      port: 5173,
      watch: {
        usePolling: true, // Necessary for some systems, especially in Docker
      },
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
