import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	plugins: [tailwindcss(), react()],
	resolve: {
		alias: {
			"@main": path.resolve(__dirname, "main"),
			"@renderer": path.resolve(__dirname, "renderer"),
			"@shared": path.resolve(__dirname, "shared"),
		},
	},
});
