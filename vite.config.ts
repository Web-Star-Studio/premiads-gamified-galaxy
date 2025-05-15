import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/purchase-credits': {
        target: 'https://zfryjwaeojccskfiibtq.supabase.co/functions/v1/purchase-credits',
        changeOrigin: true,
        rewrite: () => '',
      },
      '/api/confirm-payment': {
        target: 'https://zfryjwaeojccskfiibtq.supabase.co/functions/v1/confirm-payment',
        changeOrigin: true,
        rewrite: () => '',
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Custom field for test script that could be read by a helper tool
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './jest.setup.ts',
  }
}));
