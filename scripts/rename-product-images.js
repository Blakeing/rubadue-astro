import fs from "node:fs/promises";
import path from "node:path";

const NEW_DIR = "src/assets/products/catalog";

// Mapping of old names to new names
const nameMapping = {
	"Triple TCA3 - Gray.webp": "triple-tca3-003-gray.webp",
	"Triple PFA .0015 - yellow.webp": "triple-pfa-0015-yellow.webp",
	"Triple PFA .003 - yellow.webp": "triple-pfa-003-yellow.webp",
	"Triple Litz TCA3 - gray.webp": "litz-tca3-003-gray.webp",
	"Triple Litz FEP Insulation - black.webp": "litz-fep-003-black.webp",
	"Triple LITZ EFTE Wire - red.webp": "litz-etfe-003-red.webp",
	"Triple Insulated FEP .002.webp": "triple-fep-002-black.webp",
	"Triple FEP .003 - black.webp": "triple-fep-003-black.webp",
	"Triple Chemours TEFZEL ETFE .003 - red.webp": "triple-etfe-003-red.webp",
	"Triple Chemours TEFZEL ETFE .001 - red.webp": "triple-etfe-001-red.webp",
	"Single TCA1 - orange.webp": "single-tca1-003-orange.webp",
	"Single PFA .003 - yellow.webp": "single-pfa-003-yellow.webp",
	"Single PFA -0015 - yellow.webp": "single-pfa-0015-yellow.webp",
	"Single Litz FEP Insulation - black.webp": "litz-fep-003-black.webp",
	"Single FEP .003 - black.webp": "single-fep-003-black.webp",
	"Single FEP .002 - black.webp": "single-fep-002-black.webp",
	"Single Chemours TEFZEL ETFE .0015 - red.webp": "single-etfe-0015-red.webp",
	"Single Chemours TEFZEL ETFE .003 - red.webp": "single-etfe-003-red.webp",
	"Double TCA2 - blue.webp": "double-tca2-003-blue.webp",
	"Double PFA .0015 - yellow.webp": "double-pfa-0015-yellow.webp",
	"Double PFA .003 - yellow.webp": "double-pfa-003-yellow.webp",
	"Double Litz FEP Insulation - black.webp": "litz-fep-003-black.webp",
	"Double Litz ETFE Insulation - red.webp": "litz-etfe-003-red.webp",
	"Double Insulated Chemours TEFZEL ETFE .003.webp": "double-etfe-003-red.webp",
	"Double FEP .003 - black.webp": "double-fep-003-black.webp",
	"Double FEP .002 - black.webp": "double-fep-002-black.webp",
	"Double Chemours TEFZEL ETFE .001 - Red.webp": "double-etfe-001-red.webp",
};

// Create a reverse mapping for updating references
const reverseMapping = Object.entries(nameMapping).reduce(
	(acc, [oldName, newName]) => {
		acc[oldName] = newName;
		return acc;
	},
	{},
);

async function renameFiles() {
	try {
		const files = await fs.readdir(NEW_DIR);

		for (const file of files) {
			if (nameMapping[file]) {
				const oldPath = path.join(NEW_DIR, file);
				const newPath = path.join(NEW_DIR, nameMapping[file]);

				console.log(`Renaming ${file} to ${nameMapping[file]}`);
				await fs.rename(oldPath, newPath);
			}
		}

		console.log("File renaming completed successfully");
		return reverseMapping;
	} catch (error) {
		console.error("Error renaming files:", error);
		throw error;
	}
}

export { renameFiles, reverseMapping };
