import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const PRODUCTS_DIR = "src/content/products";

// Mapping of old image paths to new ones
const imagePathMapping = {
	"@/assets/products/Triple_PFA__001_yellow.jpg":
		"@/assets/products/catalog/triple-pfa-002-yellow.webp",
	"@/assets/products/Triple_Chemours_TEFZEL_ETFE__001_red.jpg":
		"@/assets/products/catalog/triple-etfe-002-red.webp",
	"@/assets/products/Triple_FEP__001_black.jpg":
		"@/assets/products/catalog/triple-fep-002-black.webp",
	"@/assets/products/Double_PFA__001_yellow.jpg":
		"@/assets/products/catalog/double-pfa-002-yellow.webp",
	"@/assets/products/Double_Chemours_TEFZEL_ETFE__001_red.jpg":
		"@/assets/products/catalog/double-etfe-002-red.webp",
	"@/assets/products/Double_FEP__001_black.jpg":
		"@/assets/products/catalog/double-fep-002-black.webp",
	"@/assets/products/Single_PFA__001_yellow.jpg":
		"@/assets/products/catalog/single-pfa-002-yellow.webp",
	"@/assets/products/Single_Chemours_TEFZEL_ETFE__001_red.jpg":
		"@/assets/products/catalog/single-etfe-002-red.webp",
	"@/assets/products/Single_FEP__001_black.jpg":
		"@/assets/products/catalog/single-fep-002-black.webp",
	"@/assets/products/catalog/Triple PFA .002 - yellow.webp":
		"@/assets/products/catalog/triple-pfa-002-yellow.webp",
	"@/assets/products/catalog/Triple Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/catalog/triple-etfe-002-red.webp",
	"@/assets/products/catalog/Triple FEP .002 - black.webp":
		"@/assets/products/catalog/triple-fep-002-black.webp",
	"@/assets/products/catalog/Double PFA .002 - yellow.webp":
		"@/assets/products/catalog/double-pfa-002-yellow.webp",
	"@/assets/products/catalog/Double Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/catalog/double-etfe-002-red.webp",
	"@/assets/products/catalog/Double FEP .002 - black.webp":
		"@/assets/products/catalog/double-fep-002-black.webp",
	"@/assets/products/catalog/Single PFA .002 - yellow.webp":
		"@/assets/products/catalog/single-pfa-002-yellow.webp",
	"@/assets/products/catalog/Single Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/catalog/single-etfe-002-red.webp",
	"@/assets/products/catalog/Single FEP .002 - black.webp":
		"@/assets/products/catalog/single-fep-002-black.webp",
};

async function updateMdxFiles() {
	try {
		// Find all MDX files in the products directory
		const mdxFiles = await glob("**/*.mdx", { cwd: PRODUCTS_DIR });

		for (const file of mdxFiles) {
			const filePath = path.join(PRODUCTS_DIR, file);
			let content = await fs.readFile(filePath, "utf-8");
			let updated = false;

			// Check for each old path and replace with new path
			for (const [oldPath, newPath] of Object.entries(imagePathMapping)) {
				if (content.includes(oldPath)) {
					content = content.replace(new RegExp(oldPath, "g"), newPath);
					updated = true;
				}
			}

			if (updated) {
				console.log(`Updating references in ${file}`);
				await fs.writeFile(filePath, content, "utf-8");
			}
		}

		console.log("MDX file updates completed successfully");
	} catch (error) {
		console.error("Error updating MDX files:", error);
		throw error;
	}
}

export { updateMdxFiles };
