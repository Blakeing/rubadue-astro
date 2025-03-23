import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { glob } from "glob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(
	path.dirname(__dirname),
	"src",
	"content",
	"products",
);
const publicProductsDir = path.join(
	path.dirname(__dirname),
	"public",
	"products",
);

// Get all product images
const getProductImages = () => {
	return fs
		.readdirSync(publicProductsDir)
		.filter((file) => file.endsWith(".jpg") || file.endsWith(".jpeg"))
		.map((file) => ({
			path: `/products/${file}`,
			name: file.toLowerCase(),
			type: file.split("_")[0].toLowerCase(),
			material: file.split("_")[1]?.toLowerCase() || "",
			gauge: file.split("_")[2]?.toLowerCase() || "",
		}));
};

// Function to find the best matching image for an MDX file
const findMatchingImage = (mdxPath, images) => {
	const pathParts = mdxPath.split(path.sep);
	const category = pathParts[pathParts.length - 2]?.toLowerCase(); // e.g., 'pfa', 'fep'
	const gauge = pathParts[pathParts.length - 1]
		.split("-")[0]
		.replace("layer", "")
		.toLowerCase(); // e.g., '0015'
	const type = pathParts[pathParts.length - 3]
		?.toLowerCase()
		.replace("-insulated", ""); // e.g., 'single', 'double'

	return images.find(
		(img) =>
			img.type.includes(type) &&
			img.material.toLowerCase().includes(category) &&
			(img.gauge.includes(gauge) || gauge.includes(img.gauge)),
	);
};

// Update MDX files
const updateMdxFiles = async () => {
	const images = getProductImages();
	const mdxFiles = await glob("**/*.mdx", { cwd: contentDir });

	for (const mdxFile of mdxFiles) {
		const fullPath = path.join(contentDir, mdxFile);
		let content = fs.readFileSync(fullPath, "utf8");

		// Skip if no heroImage field
		if (!content.includes("heroImage:")) continue;

		const matchingImage = findMatchingImage(mdxFile, images);
		if (matchingImage) {
			// Update heroImage field
			content = content.replace(
				/heroImage:.*$/m,
				`heroImage: "${matchingImage.path}"`,
			);

			fs.writeFileSync(fullPath, content);
			console.log(`Updated image in ${mdxFile} to ${matchingImage.path}`);
		} else {
			console.log(`No matching image found for ${mdxFile}`);
		}
	}
};

updateMdxFiles().catch(console.error);
