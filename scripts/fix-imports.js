#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { glob } from "glob";

console.log("🔧 Fixing critical import issues...\n");

// Find all files that need import fixes
const files = glob.sync("src/**/*.{tsx,ts,astro,mdx}");

let fixedFiles = 0;

for (const file of files) {
	try {
		const content = readFileSync(file, "utf-8");
		let newContent = content;
		let hasChanges = false;

		// Fix common import issues
		const fixes = [
			// Fix old component paths that weren't caught by the migration
			[/@\/components\/react\/icons/g, "@/components/ui/icons"],
			[/@\/components\/icons/g, "@/components/ui/icons"],
			[
				/@\/components\/MarketCard/g,
				"@/components/sections/content-blocks/MarketCard",
			],
			[
				/@\/components\/about\/Timeline/g,
				"@/components/pages/company/Timeline",
			],
			[/@\/components\/products/g, "@/components/sections/product-showcase"],
			[
				/@\/components\/interactive/g,
				"@/components/data-display/interactive-tools",
			],
			[/@\/components\/search/g, "@/components/data-display/search-results"],
			[
				/@\/components\/common\/FormattedDate\.astro/g,
				"@/components/layout/containers/FormattedDate.astro",
			],
			[
				/@\/components\/common\/Prose\.astro/g,
				"@/components/layout/containers/Prose.astro",
			],
			[
				/@\/components\/forms\/pcim\/PcimForm/g,
				"@/components/forms/event-registration/PcimForm",
			],
			[
				/@\/components\/forms\/n1-max\/N1MaxCalculatorForm/g,
				"@/components/forms/product-tools/N1MaxCalculatorForm",
			],
			[
				/@\/components\/forms\/litz-wire\/LitzWireForm/g,
				"@/components/forms/product-tools/LitzWireForm",
			],
			[
				/@\/components\/forms\/insulated-winding-wire\/InsulatedWindingWireForm/g,
				"@/components/forms/product-tools/InsulatedWindingWireForm",
			],
			[
				/@\/components\/pages\/RequestQuotePage/g,
				"@/components/pages/quote-request/RequestQuotePage",
			],
			[
				/@\/components\/pages\/ProductListingPage/g,
				"@/components/pages/product-catalog/ProductListingPage",
			],
			[
				/@\/components\/pages\/ProductPage/g,
				"@/components/pages/product-catalog/ProductDetailPage",
			],
			[
				/@\/components\/interactive\/WorldMap/g,
				"@/components/data-display/interactive-tools/WorldMap",
			],
			[
				/@\/components\/interactive\/Glossary/g,
				"@/components/data-display/interactive-tools/TechnicalGlossary",
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

console.log(`\n📊 Fixed imports in ${fixedFiles} files`);
console.log("🎉 Import fixes completed!");
