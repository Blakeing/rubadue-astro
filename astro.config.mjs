// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
// import tailwind from "@astrojs/tailwind"; // Removed
import vercel from "@astrojs/vercel";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import tailwindcss from "@tailwindcss/vite"; // Added

// https://astro.build/config
export default defineConfig({
	site: "https://rubadue.com",
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	integrations: [
		mdx({
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatex],
		}),
		sitemap(),
		react(),
	],
	image: {
		remotePatterns: [{ protocol: "https" }],
		domains: ["picsum.photos"],
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
	},
	output: "server",
	adapter: vercel(),
	vite: {
		// Added vite config
		plugins: [tailwindcss()],
	},
});
