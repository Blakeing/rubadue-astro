import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const PRODUCTS_DIR = "src/content/products";

// Mapping of old image paths to new ones
const imagePathMapping = {
	"@/assets/products/Triple_PFA__001_yellow.jpg":
		"@/assets/products/new/triple-pfa-002-yellow.webp",
	"@/assets/products/Triple_Chemours_TEFZEL_ETFE__001_red.jpg":
		"@/assets/products/new/triple-etfe-002-red.webp",
	"@/assets/products/Triple_FEP__001_black.jpg":
		"@/assets/products/new/triple-fep-002-black.webp",
	"@/assets/products/Double_PFA__001_yellow.jpg":
		"@/assets/products/new/double-pfa-002-yellow.webp",
	"@/assets/products/Double_Chemours_TEFZEL_ETFE__001_red.jpg":
		"@/assets/products/new/double-etfe-002-red.webp",
	"@/assets/products/Double_FEP__001_black.jpg":
		"@/assets/products/new/double-fep-002-black.webp",
	"@/assets/products/Single_PFA__001_yellow.jpg":
		"@/assets/products/new/single-pfa-002-yellow.webp",
	"@/assets/products/Single_Chemours_TEFZEL_ETFE__001_red.jpg":
		"@/assets/products/new/single-etfe-002-red.webp",
	"@/assets/products/Single_FEP__001_black.jpg":
		"@/assets/products/new/single-fep-002-black.webp",
	"@/assets/products/new/Triple PFA .002 - yellow.webp":
		"@/assets/products/new/triple-pfa-002-yellow.webp",
	"@/assets/products/new/Triple Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/new/triple-etfe-002-red.webp",
	"@/assets/products/new/Triple FEP .002 - black.webp":
		"@/assets/products/new/triple-fep-002-black.webp",
	"@/assets/products/new/Double PFA .002 - yellow.webp":
		"@/assets/products/new/double-pfa-002-yellow.webp",
	"@/assets/products/new/Double Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/new/double-etfe-002-red.webp",
	"@/assets/products/new/Double FEP .002 - black.webp":
		"@/assets/products/new/double-fep-002-black.webp",
	"@/assets/products/new/Single PFA .002 - yellow.webp":
		"@/assets/products/new/single-pfa-002-yellow.webp",
	"@/assets/products/new/Single Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/new/single-etfe-002-red.webp",
	"@/assets/products/new/Single FEP .002 - black.webp":
		"@/assets/products/new/single-fep-002-black.webp",
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
