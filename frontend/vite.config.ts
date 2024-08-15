import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    optimizeDeps: {
      include: ["react", "react-dom"]
    },
    base: command === "build" ? "/letter-reader/" : "/",
  }
});
