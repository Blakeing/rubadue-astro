#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "glob";

// Find all MDX files that need updating
const mdxFiles = glob.sync("src/content/products/**/*.mdx");

let updatedCount = 0;

for (const file of mdxFiles) {
	const content = readFileSync(file, "utf-8");

	// Check if this file uses one of the old table components
	if (
		content.includes("SingleInsulatedTable") ||
		content.includes("DoubleInsulatedTable") ||
		content.includes("TripleInsulatedTable")
	) {
		let newContent = content;

		// Replace SingleInsulatedTable imports and usage
		newContent = newContent.replace(
			/import { SingleInsulatedTable } from "@\/components\/react\/data-table\/single-insulated\/([^"]+)\/table";/g,
			'import { WireDataTable } from "@/components/react/data-table";\nimport { wireData } from "@/components/react/data-table/single-insulated/$1/data";',
		);

		// Replace DoubleInsulatedTable imports and usage
		newContent = newContent.replace(
			/import { DoubleInsulatedTable } from "@\/components\/react\/data-table\/double-insulated\/([^"]+)\/table";/g,
			'import { WireDataTable } from "@/components/react/data-table";\nimport { wireData } from "@/components/react/data-table/double-insulated/$1/data";',
		);

		// Replace TripleInsulatedTable imports and usage
		newContent = newContent.replace(
			/import { TripleInsulatedTable } from "@\/components\/react\/data-table\/triple-insulated\/([^"]+)\/table";/g,
			'import { WireDataTable } from "@/components/react/data-table";\nimport { wireData } from "@/components/react/data-table/triple-insulated/$1/data";',
		);

		// Replace component usage
		newContent = newContent.replace(
			/<(SingleInsulatedTable|DoubleInsulatedTable|TripleInsulatedTable)([^>]*)\s*\/>/g,
			"<WireDataTable data={wireData}$2 />",
		);

		// Handle multi-line component usage
		newContent = newContent.replace(
			/<(SingleInsulatedTable|DoubleInsulatedTable|TripleInsulatedTable)([^>]*)>/g,
			"<WireDataTable data={wireData}$2>",
		);

		newContent = newContent.replace(
			/<\/(SingleInsulatedTable|DoubleInsulatedTable|TripleInsulatedTable)>/g,
			"</WireDataTable>",
		);

		if (newContent !== content) {
			writeFileSync(file, newContent);
			console.log(`Updated ${file}`);
			updatedCount++;
		}
	}
}

console.log(`\nUpdated ${updatedCount} MDX files`);
