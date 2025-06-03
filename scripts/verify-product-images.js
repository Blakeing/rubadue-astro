import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const PRODUCTS_DIR = "src/content/products";
const IMAGES_DIR = "src/assets/products/catalog";

async function verifyImages() {
	try {
		// Get all image files
		const imageFiles = await fs.readdir(IMAGES_DIR);
		const imageSet = new Set(imageFiles);

		// Get all MDX files
		const mdxFiles = await glob("**/*.mdx", { cwd: PRODUCTS_DIR });
		let hasErrors = false;

		console.log("Verifying product image references...\n");

		for (const file of mdxFiles) {
			const filePath = path.join(PRODUCTS_DIR, file);
			const content = await fs.readFile(filePath, "utf-8");

			// Extract heroImage path
			const heroImageMatch = content.match(/heroImage:\s*"([^"]+)"/);
			if (heroImageMatch) {
				const imagePath = heroImageMatch[1];
				const imageName = imagePath.split("/").pop();

				if (!imageSet.has(imageName)) {
					console.error(`❌ ${file}: Image not found: ${imageName}`);
					hasErrors = true;
				} else {
					console.log(`✅ ${file}: Image reference is valid`);
				}
			} else {
				console.warn(`⚠️ ${file}: No heroImage found`);
			}
		}

		if (!hasErrors) {
			console.log("\n✅ All image references are valid!");
		} else {
			console.error(
				"\n❌ Some image references are invalid. Please check the errors above.",
			);
			process.exit(1);
		}
	} catch (error) {
		console.error("Error verifying images:", error);
		process.exit(1);
	}
}

verifyImages();
