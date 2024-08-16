import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@app": "/src",
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".css"],
  },
  plugins: [vue()],

  build: {
    rollupOptions: {
      output: {
        manualChunks: (id, {getModuleInfo}) => {
          let asyncDir = "";
          if (getModuleInfo(id)?.dynamicImporters.length) {
            asyncDir = "@/";
          }

          const namespacedVendorMatch = id.match(/\/node_modules\/(@[^/]+\/[^/]+)(\/|$)/); 
          if (namespacedVendorMatch) {
            return "vendor/" + asyncDir + namespacedVendorMatch[1].replace(/[^a-z0-9@/]/i,'__');
          }
          const vendorMatch = id.match(/\/node_modules\/([^/]+)(\/|$)/); 
          if (vendorMatch) {
            return "vendor/" + asyncDir + vendorMatch[1].replace(/[^a-z0-9]/i,'__');
          }

          return '';
        }
      }
    }
  }
});
