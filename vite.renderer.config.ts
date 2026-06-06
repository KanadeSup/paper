import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./renderer/routes",
			generatedRouteTree: "./renderer/routeTree.gen.ts",
			routeFileIgnorePrefix: "-",
			quoteStyle: "double",
		}),
		react(),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@main": path.resolve(__dirname, "main"),
			"@renderer": path.resolve(__dirname, "renderer"),
			"@shared": path.resolve(__dirname, "shared"),
		},
	},
});
