import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsDir = path.join(path.dirname(__dirname), "public", "products");

// Mapping of gauge values
const gaugeMap = {
	".001": "001",
	".0015": "0015",
	".002": "002",
	".003": "003",
};

// Function to clean and standardize the filename
function standardizeFilename(filename) {
	// Remove file extension
	const nameWithoutExt = path.parse(filename).name;

	// Split into parts
	const parts = nameWithoutExt.split(" - ");

	// Handle the first part (insulation type and wire type)
	const firstPart = parts[0].trim();

	// Handle the second part (color)
	const color = parts[1]?.trim().toLowerCase() || "";

	// Extract gauge from the first part
	let gauge = "";
	for (const [key, value] of Object.entries(gaugeMap)) {
		if (firstPart.includes(key)) {
			gauge = value;
			break;
		}
	}

	// Clean up the wire type
	const wireType = firstPart
		.replace(/\.\d+/, "") // Remove gauge numbers
		.replace(/Insulated\s+/, "") // Remove "Insulated" word
		.replace(/\s+/g, "_") // Replace spaces with underscores
		.trim();

	// Construct new filename
	const newFilename = `${wireType}_${gauge}_${color}.jpg`;

	return newFilename;
}

// Read all files in the products directory
fs.readdir(productsDir, (err, files) => {
	if (err) {
		console.error("Error reading directory:", err);
		return;
	}

	// Process each file
	for (const file of files) {
		if (file.endsWith(".jpg") || file.endsWith(".jpeg")) {
			const oldPath = path.join(productsDir, file);
			const newFilename = standardizeFilename(file);
			const newPath = path.join(productsDir, newFilename);

			// Rename the file
			fs.rename(oldPath, newPath, (err) => {
				if (err) {
					console.error(`Error renaming ${file}:`, err);
				} else {
					console.log(`Renamed: ${file} -> ${newFilename}`);
				}
			});
		}
	}
});
