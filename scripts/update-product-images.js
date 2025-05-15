import fs from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const PRODUCTS_DIR = "src/content/products";
const IMAGES_DIR = "src/assets/products/new";

// Map of old image paths to new image paths
const imagePathMapping = {
	// Triple Insulated
	"@/assets/products/new/Triple TCA3 - gray.webp":
		"@/assets/products/new/triple-tca3-003-gray.webp",
	"@/assets/products/new/Triple PFA .003 - yellow.webp":
		"@/assets/products/new/triple-pfa-003-yellow.webp",
	"@/assets/products/new/Triple PFA .002 - yellow.webp":
		"@/assets/products/new/triple-pfa-003-yellow.webp",
	"@/assets/products/new/Triple PFA .0015 - yellow.webp":
		"@/assets/products/new/triple-pfa-0015-yellow.webp",
	"@/assets/products/new/Triple FEP .005 - black.webp":
		"@/assets/products/new/triple-fep-003-black.webp",
	"@/assets/products/new/Triple FEP .003 - black.webp":
		"@/assets/products/new/triple-fep-003-black.webp",
	"@/assets/products/new/Triple FEP .002 - black.webp":
		"@/assets/products/new/triple-fep-002-black.webp",
	"@/assets/products/new/Triple Chemours TEFZEL ETFE .003 - red.webp":
		"@/assets/products/new/triple-etfe-003-red.webp",
	"@/assets/products/new/Triple Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/new/triple-etfe-003-red.webp",
	"@/assets/products/new/Triple Chemours TEFZEL ETFE .0015 - red.webp":
		"@/assets/products/new/triple-etfe-003-red.webp",
	"@/assets/products/new/Triple Chemours TEFZEL ETFE .001 - red.webp":
		"@/assets/products/new/triple-etfe-001-red.webp",
	// Direct .002 references
	"@/assets/products/new/triple-pfa-002-yellow.webp":
		"@/assets/products/new/triple-pfa-003-yellow.webp",
	"@/assets/products/new/triple-etfe-002-red.webp":
		"@/assets/products/new/triple-etfe-003-red.webp",

	// Single Insulated
	"@/assets/products/new/Single TCA1 - orange.webp":
		"@/assets/products/new/single-tca1-003-orange.webp",
	"@/assets/products/new/Single PFA .003 - yellow.webp":
		"@/assets/products/new/single-pfa-003-yellow.webp",
	"@/assets/products/new/Single PFA .002 - yellow.webp":
		"@/assets/products/new/single-pfa-003-yellow.webp",
	"@/assets/products/new/Single PFA -0015 - yellow.webp":
		"@/assets/products/new/single-pfa-0015-yellow.webp",
	"@/assets/products/new/Single FEP .003 - black.webp":
		"@/assets/products/new/single-fep-003-black.webp",
	"@/assets/products/new/Single FEP .002 - black.webp":
		"@/assets/products/new/single-fep-002-black.webp",
	"@/assets/products/new/Single Chemours TEFZEL ETFE .003 - red.webp":
		"@/assets/products/new/single-etfe-003-red.webp",
	"@/assets/products/new/Single Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/new/single-etfe-003-red.webp",
	"@/assets/products/new/Single Chemours TEFZEL ETFE .0015 - red.webp":
		"@/assets/products/new/single-etfe-0015-red.webp",
	// Direct .002 references
	"@/assets/products/new/single-pfa-002-yellow.webp":
		"@/assets/products/new/single-pfa-003-yellow.webp",
	"@/assets/products/new/single-etfe-002-red.webp":
		"@/assets/products/new/single-etfe-003-red.webp",

	// Double Insulated
	"@/assets/products/new/Double TCA2 - blue.webp":
		"@/assets/products/new/double-tca2-003-blue.webp",
	"@/assets/products/new/Double PFA .003 - yellow.webp":
		"@/assets/products/new/double-pfa-003-yellow.webp",
	"@/assets/products/new/Double PFA .002 - yellow.webp":
		"@/assets/products/new/double-pfa-003-yellow.webp",
	"@/assets/products/new/Double PFA .0015 - yellow.webp":
		"@/assets/products/new/double-pfa-0015-yellow.webp",
	"@/assets/products/new/Double FEP .003 - black.webp":
		"@/assets/products/new/double-fep-003-black.webp",
	"@/assets/products/new/Double FEP .002 - black.webp":
		"@/assets/products/new/double-fep-002-black.webp",
	"@/assets/products/new/Double Insulated Chemours TEFZEL ETFE .003.webp":
		"@/assets/products/new/double-etfe-003-red.webp",
	"@/assets/products/new/Double Chemours TEFZEL ETFE .002 - red.webp":
		"@/assets/products/new/double-etfe-003-red.webp",
	"@/assets/products/new/Double Chemours TEFZEL ETFE .0015 - red.webp":
		"@/assets/products/new/double-etfe-003-red.webp",
	"@/assets/products/new/Double Chemours TEFZEL ETFE .001 - Red.webp":
		"@/assets/products/new/double-etfe-001-red.webp",
	// Direct .002 references
	"@/assets/products/new/double-pfa-002-yellow.webp":
		"@/assets/products/new/double-pfa-003-yellow.webp",
	"@/assets/products/new/double-etfe-002-red.webp":
		"@/assets/products/new/double-etfe-003-red.webp",

	// Litz Wire
	"@/assets/products/new/Triple Litz TCA3 - gray.webp":
		"@/assets/products/new/litz-tca3-003-gray.webp",
	"@/assets/products/new/Triple Litz FEP Insulation - black.webp":
		"@/assets/products/new/litz-fep-003-black.webp",
	"@/assets/products/new/Triple LITZ EFTE Wire - red.webp":
		"@/assets/products/new/litz-etfe-003-red.webp",
	"@/assets/products/new/Single Litz FEP Insulation - black.webp":
		"@/assets/products/new/litz-fep-003-black.webp",
	"@/assets/products/new/Double Litz FEP Insulation - black.webp":
		"@/assets/products/new/litz-fep-003-black.webp",
	"@/assets/products/new/Double Litz ETFE Insulation - red.webp":
		"@/assets/products/new/litz-etfe-003-red.webp",
	"@/assets/products/new/Litz Wire Bare.webp":
		"@/assets/products/new/litz-fep-003-black.webp", // Using FEP as placeholder
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
