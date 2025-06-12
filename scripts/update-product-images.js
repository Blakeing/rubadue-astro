import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const PRODUCTS_DIR = "src/content/products";
const IMAGES_DIR = "src/assets/products/catalog";

// Map of old image paths to new image paths
const imagePathMapping = {
	// Triple Insulated
	"@/assets/products/catalog/Triple TCA3 - gray.webp":
		"@/assets/products/catalog/triple-tca3-003-gray.webp",
	"@/assets/products/catalog/Triple PFA .003 - yellow.webp":
		"@/assets/products/catalog/triple-pfa-003-yellow.webp",
	"@/assets/products/catalog/Triple PFA .002 - yellow.webp":
		"@/assets/products/catalog/triple-pfa-003-yellow.webp",
	"@/assets/products/catalog/Triple PFA .0015 - yellow.webp":
		"@/assets/products/catalog/triple-pfa-0015-yellow.webp",
	"@/assets/products/catalog/Triple FEP .005 - black.webp":
		"@/assets/products/catalog/triple-fep-003-black.webp",
	"@/assets/products/catalog/Triple FEP .003 - black.webp":
		"@/assets/products/catalog/triple-fep-003-black.webp",
	"@/assets/products/catalog/Triple FEP .002 - black.webp":
		"@/assets/products/catalog/triple-fep-002-black.webp",
	"@/assets/products/catalog/Triple Chemours TEFZEL ETFE .003 - red.webp":
		"@/assets/products/catalog/triple-etfe-003-red.webp",
	"@/assets/products/catalog/Triple Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/catalog/triple-etfe-003-red.webp",
	"@/assets/products/catalog/Triple Chemours TEFZEL ETFE .0015 - red.webp":
		"@/assets/products/catalog/triple-etfe-003-red.webp",
	"@/assets/products/catalog/Triple Chemours TEFZEL ETFE .001 - red.webp":
		"@/assets/products/catalog/triple-etfe-001-red.webp",
	// Direct .002 references
	"@/assets/products/catalog/triple-pfa-002-yellow.webp":
		"@/assets/products/catalog/triple-pfa-003-yellow.webp",
	"@/assets/products/catalog/triple-etfe-002-red.webp":
		"@/assets/products/catalog/triple-etfe-003-red.webp",

	// Single Insulated
	"@/assets/products/catalog/Single TCA1 - orange.webp":
		"@/assets/products/catalog/single-tca1-003-orange.webp",
	"@/assets/products/catalog/Single PFA .003 - yellow.webp":
		"@/assets/products/catalog/single-pfa-003-yellow.webp",
	"@/assets/products/catalog/Single PFA .002 - yellow.webp":
		"@/assets/products/catalog/single-pfa-003-yellow.webp",
	"@/assets/products/catalog/Single PFA -0015 - yellow.webp":
		"@/assets/products/catalog/single-pfa-0015-yellow.webp",
	"@/assets/products/catalog/Single FEP .003 - black.webp":
		"@/assets/products/catalog/single-fep-003-black.webp",
	"@/assets/products/catalog/Single FEP .002 - black.webp":
		"@/assets/products/catalog/single-fep-002-black.webp",
	"@/assets/products/catalog/Single Chemours TEFZEL ETFE .003 - red.webp":
		"@/assets/products/catalog/single-etfe-003-red.webp",
	"@/assets/products/catalog/Single Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/catalog/single-etfe-003-red.webp",
	"@/assets/products/catalog/Single Chemours TEFZEL ETFE .0015 - red.webp":
		"@/assets/products/catalog/single-etfe-0015-red.webp",
	// Direct .002 references
	"@/assets/products/catalog/single-pfa-002-yellow.webp":
		"@/assets/products/catalog/single-pfa-003-yellow.webp",
	"@/assets/products/catalog/single-etfe-002-red.webp":
		"@/assets/products/catalog/single-etfe-003-red.webp",

	// Double Insulated
	"@/assets/products/catalog/Double TCA2 - blue.webp":
		"@/assets/products/catalog/double-tca2-003-blue.webp",
	"@/assets/products/catalog/Double PFA .003 - yellow.webp":
		"@/assets/products/catalog/double-pfa-003-yellow.webp",
	"@/assets/products/catalog/Double PFA .002 - yellow.webp":
		"@/assets/products/catalog/double-pfa-003-yellow.webp",
	"@/assets/products/catalog/Double PFA .0015 - yellow.webp":
		"@/assets/products/catalog/double-pfa-0015-yellow.webp",
	"@/assets/products/catalog/Double FEP .003 - black.webp":
		"@/assets/products/catalog/double-fep-003-black.webp",
	"@/assets/products/catalog/Double FEP .002 - black.webp":
		"@/assets/products/catalog/double-fep-002-black.webp",
	"@/assets/products/catalog/Double Insulated Chemours TEFZEL ETFE .003.webp":
		"@/assets/products/catalog/double-etfe-003-red.webp",
	"@/assets/products/catalog/Double Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/catalog/double-etfe-003-red.webp",
	"@/assets/products/catalog/Double Chemours TEFZEL ETFE .0015 - red.webp":
		"@/assets/products/catalog/double-etfe-003-red.webp",
	"@/assets/products/catalog/Double Chemours TEFZEL ETFE .001 - Red.webp":
		"@/assets/products/catalog/double-etfe-001-red.webp",
	// Direct .002 references
	"@/assets/products/catalog/double-pfa-002-yellow.webp":
		"@/assets/products/catalog/double-pfa-003-yellow.webp",
	"@/assets/products/catalog/double-etfe-002-red.webp":
		"@/assets/products/catalog/double-etfe-003-red.webp",

	// Litz Wire
	"@/assets/products/catalog/Triple Litz TCA3 - gray.webp":
		"@/assets/products/catalog/litz-tca3-003-gray.webp",
	"@/assets/products/catalog/Triple Litz FEP Insulation - black.webp":
		"@/assets/products/catalog/litz-fep-003-black.webp",
	"@/assets/products/catalog/Triple LITZ EFTE Wire - red.webp":
		"@/assets/products/catalog/litz-etfe-003-red.webp",
	"@/assets/products/catalog/Single Litz FEP Insulation - black.webp":
		"@/assets/products/catalog/litz-fep-003-black.webp",
	"@/assets/products/catalog/Double Litz FEP Insulation - black.webp":
		"@/assets/products/catalog/litz-fep-003-black.webp",
	"@/assets/products/catalog/Double Litz ETFE Insulation - red.webp":
		"@/assets/products/catalog/litz-etfe-003-red.webp",
	"@/assets/products/catalog/Litz Wire Bare.webp":
		"@/assets/products/catalog/litz-fep-003-black.webp", // Using FEP as placeholder
};

async function updateMdxFiles() {
	try {
		const mdxFiles = await glob("**/*.mdx", { cwd: PRODUCTS_DIR });
		let updatedCount = 0;

		for (const file of mdxFiles) {
			const filePath = path.join(PRODUCTS_DIR, file);
			let content = await fs.readFile(filePath, "utf-8");
			let fileUpdated = false;

			for (const [oldPath, newPath] of Object.entries(imagePathMapping)) {
				if (content.includes(oldPath)) {
					content = content.replace(new RegExp(oldPath, "g"), newPath);
					fileUpdated = true;
				}
			}

			if (fileUpdated) {
				await fs.writeFile(filePath, content, "utf-8");
				updatedCount++;
				console.log(`Updated ${file}`);
			}
		}

		console.log(`\nUpdated ${updatedCount} MDX files`);
	} catch (error) {
		console.error("Error updating MDX files:", error);
		process.exit(1);
	}
}

console.log("Starting product image updates...\n");
updateMdxFiles().then(() => {
	console.log("\nAll updates completed successfully!");
});
