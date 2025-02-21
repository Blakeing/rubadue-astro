// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [
		mdx(),
		sitemap(),
		react(),
		tailwind({
			applyBaseStyles: false,
		}),
	],
	image: {
		remotePatterns: [{ protocol: "https" }],
		domains: ["picsum.photos"],
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
	},
	vite: {
		resolve: {
			alias: {
				"@": "/src",
			},
		},
		build: {
			rollupOptions: {
				output: {
					manualChunks: undefined,
				},
			},
		},
	},
});
