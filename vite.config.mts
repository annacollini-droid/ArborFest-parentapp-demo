import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/ArborFest-parentapp-demo/",
  server: {
    port: 5173
  }
});

