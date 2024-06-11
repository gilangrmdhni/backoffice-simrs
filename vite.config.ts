import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, {resolve} from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
    },
    build: {
      rollupOptions: {
        external: [
          '@fortawesome/fontawesome-svg-core', // Mark as external
          '@fortawesome/free-solid-svg-icons',
          '@fortawesome/react-fontawesome'
        ]
      }
    }
});
