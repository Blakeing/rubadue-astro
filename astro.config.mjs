import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
// @ts-check
import { defineConfig } from "astro/config";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

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
		tailwind({
			applyBaseStyles: false,
		}),
	],
	image: {
		service: {
			entrypoint: "astro/assets/services/sharp",
		},
		remotePatterns: [{ protocol: "https" }],
		domains: ["picsum.photos"],
	},
	output: "server",
	adapter: vercel({
		maxDuration: 30,
		includeFiles: ["./node_modules/sharp/**/*"],
	}),
});
