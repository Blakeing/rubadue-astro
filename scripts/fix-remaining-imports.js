#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "glob";

console.log("🔧 Fixing remaining import issues...\n");

// Find all files that need import fixes
const files = glob.sync("src/**/*.{tsx,ts,astro,mdx}");

let fixedFiles = 0;

for (const file of files) {
	try {
		const content = readFileSync(file, "utf-8");
		let newContent = content;
		let hasChanges = false;

		// Fix remaining import issues
		const fixes = [
			// Fix shared FormFields imports
			[/@\/components\/shared\/FormFields/g, "@/components/ui/FormFields"],

			// Fix ProductImage imports
			[
				/@\/components\/ProductImage/g,
				"@/components/sections/product-showcase/ProductImage",
			],

			// Fix relative ui imports in pages
			[/from "\.\.\/ui\/card"/g, 'from "@/components/ui/card"'],

			// Fix missing layout imports
			[/from '\.\/backgrounds'/g, "from './layout/backgrounds'"],
			[/from '\.\/footer'/g, "from './layout/footer'"],
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

console.log(`\n📊 Fixed imports in ${fixedFiles} files`);
console.log("🎉 Remaining import fixes completed!");
