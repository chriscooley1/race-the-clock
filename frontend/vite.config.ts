import { defineConfig, loadEnv, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",
    define: {
      "import.meta.env.MODE": JSON.stringify(mode),
      "import.meta.env.VITE_AUTH0_DOMAIN": JSON.stringify(
        env.VITE_AUTH0_DOMAIN,
      ),
      "import.meta.env.VITE_AUTH0_CLIENT_ID": JSON.stringify(
        env.VITE_AUTH0_CLIENT_ID,
      ),
      "import.meta.env.VITE_AUTH0_AUDIENCE": JSON.stringify(
        env.VITE_AUTH0_AUDIENCE,
      ),
      "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
        env.VITE_API_BASE_URL,
      ),
      "import.meta.env.VITE_AUTH0_REDIRECT_URI": JSON.stringify(
        env.VITE_AUTH0_REDIRECT_URI,
      ),
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].[hash].js`,
          chunkFileNames: `assets/[name].[hash].js`,
          assetFileNames: `assets/[name].[hash].[ext]`,
          manualChunks(id) {
            if (id.includes("node_modules")) {
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
        },
      },
      outDir: "dist",
      chunkSizeWarningLimit: 1000,
      sourcemap: true,
    },
    server: {
      host: "0.0.0.0",
      port: parseInt(env.PORT || "5173"),
      watch: {
        usePolling: true,
      },
    },
    preview: {
      port: parseInt(env.PORT || "5173"),
      host: "0.0.0.0",
    },
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  };
});
