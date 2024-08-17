import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const basePath = command === "build" ? "/letter-reader/" : "/";

  return {
    plugins: [react()],
    optimizeDeps: {
      include: ["react", "react-dom"]
    },
    base: basePath,
  };
});
