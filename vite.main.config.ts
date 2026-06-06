import path from "node:path";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	build: {
		lib: {
			entry: "./main/main.ts",
			formats: ["cjs"],
			fileName: () => `main.cjs`,
		},
		rollupOptions: {
			external: ["@embedpdf/pdfium"],
		},
	},
	resolve: {
		alias: {
			"@main": path.resolve(__dirname, "main"),
			"@renderer": path.resolve(__dirname, "renderer"),
			"@shared": path.resolve(__dirname, "shared"),
		},
	},
});
