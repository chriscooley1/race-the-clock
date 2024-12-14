import { defineConfig, loadEnv, ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    base: "/",
    publicDir: "public",
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
          manualChunks: undefined,
          assetFileNames: "assets/[name].[hash][extname]",
          chunkFileNames: "assets/[name].[hash].js",
          entryFileNames: "assets/[name].[hash].js",
        }
      },
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true
    },
    optimizeDeps: {
      include: ["react-icons"],
    },
    server: {
      host: "0.0.0.0",
      port: parseInt(env.PORT || "5173"),
      watch: {
        usePolling: true,
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
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
