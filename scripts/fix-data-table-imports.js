#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "glob";

console.log("🔧 Fixing data-table import issues...\n");

// Find all files that need data-table import fixes
const files = glob.sync("src/components/react/data-table/**/*.{tsx,ts}");

let fixedFiles = 0;

for (const file of files) {
	try {
		const content = readFileSync(file, "utf-8");
		let newContent = content;
		let hasChanges = false;

		// Fix data-table import paths
		const fixes = [
			[
				/@\/components\/data-table\/types/g,
				"@/components/data-display/product-tables/types",
			],
			[
				/@\/components\/data-table\/components\/data-table/g,
				"@/components/data-display/product-tables/components/data-table",
			],
			[
				/@\/components\/data-table\/insulated-litz\/types/g,
				"@/components/data-display/product-tables/insulated-litz/types",
			],
			[
				/@\/components\/data-table/g,
				"@/components/data-display/product-tables",
			],
			[/@\/components\/shared\/FormFields/g, "@/components/ui/FormFields"],
			[
				/@\/components\/ProductImage/g,
				"@/components/sections/product-showcase/ProductImage",
			],
		];

		for (const [pattern, replacement] of fixes) {
			if (pattern.test(newContent)) {
				newContent = newContent.replace(pattern, replacement);
				hasChanges = true;
			}
		}

		if (hasChanges) {
			writeFileSync(file, newContent);
			console.log(`  ✅ Fixed imports in: ${file}`);
			fixedFiles++;
		}
	} catch (error) {
		console.log(`  ⚠️  Could not fix ${file}: ${error.message}`);
	}
}

// Also fix some specific page imports
const pageFiles = glob.sync("src/pages/**/*.astro");
for (const file of pageFiles) {
	try {
		const content = readFileSync(file, "utf-8");
		let newContent = content;
		let hasChanges = false;

		// Fix specific page imports
		const pageFixes = [
			[/CableSection/g, "ProductShowcase"],
			[/ProductPage/g, "ProductDetailPage"],
		];

		for (const [pattern, replacement] of pageFixes) {
			if (pattern.test(newContent)) {
				newContent = newContent.replace(pattern, replacement);
				hasChanges = true;
			}
		}

		if (hasChanges) {
			writeFileSync(file, newContent);
			console.log(`  ✅ Fixed page imports in: ${file}`);
			fixedFiles++;
		}
	} catch (error) {
		console.log(`  ⚠️  Could not fix ${file}: ${error.message}`);
	}
}

console.log(`\n📊 Fixed imports in ${fixedFiles} files`);
console.log("🎉 Data-table import fixes completed!");
