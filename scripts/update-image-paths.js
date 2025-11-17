import fs from "node:fs";
import { glob } from "glob";

// Find all MDX files
const files = await glob("src/content/**/*.mdx");

for (const file of files) {
	let content = fs.readFileSync(file, "utf8");

	// Replace image paths to use public directory
	content = content.replace(
		/heroImage: "@\/assets\/products\/(.*?)"/g,
		'heroImage: "/products/$1"',
	);

	fs.writeFileSync(file, content);
	console.log(`Updated image paths in ${file}`);
}

console.log("Updated image paths in all MDX files");
