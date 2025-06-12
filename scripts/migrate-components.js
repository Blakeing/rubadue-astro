#!/usr/bin/env node

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { glob } from "glob";

// Component migration mapping
const COMPONENT_MIGRATIONS = {
	// Pages
	"src/components/react/pages/ProductListingPage.tsx":
		"src/components/pages/product-catalog/ProductListingPage.tsx",
	"src/components/react/pages/ProductPage.tsx":
		"src/components/pages/product-catalog/ProductDetailPage.tsx",
	"src/components/react/pages/RequestQuotePage.tsx":
		"src/components/pages/quote-request/RequestQuotePage.tsx",

	// Forms
	"src/components/react/forms/contact/ContactForm.tsx":
		"src/components/forms/contact/ContactForm.tsx",
	"src/components/react/forms/quote-request/":
		"src/components/forms/quote-request/",
	"src/components/react/forms/litz-wire/":
		"src/components/forms/product-tools/",
	"src/components/react/forms/insulated-winding-wire/":
		"src/components/forms/product-tools/",
	"src/components/react/forms/n1-max/": "src/components/forms/product-tools/",
	"src/components/react/forms/pcim/":
		"src/components/forms/event-registration/",

	// Data Display
	"src/components/react/data-table/":
		"src/components/data-display/product-tables/",
	"src/components/react/search/": "src/components/data-display/search-results/",
	"src/components/react/interactive/WorldMap.tsx":
		"src/components/data-display/interactive-tools/WorldMap.tsx",
	"src/components/react/interactive/Glossary.tsx":
		"src/components/data-display/interactive-tools/TechnicalGlossary.tsx",

	// Product Sections
	"src/components/react/products/CableSection.tsx":
		"src/components/sections/product-showcase/ProductShowcase.tsx",
	"src/components/react/products/ProductList.tsx":
		"src/components/sections/product-showcase/ProductGrid.tsx",
	"src/components/react/ProductImage.tsx":
		"src/components/sections/product-showcase/ProductImage.tsx",

	// Layout
	"src/components/react/layout/Header.tsx":
		"src/components/layout/header/SiteHeader.tsx",
	"src/components/astro/layout/": "src/components/layout/",
	"src/components/astro/common/": "src/components/layout/containers/",

	// UI Components
	"src/components/react/ui/": "src/components/ui/",
	"src/components/react/shared/": "src/components/ui/",

	// Company/About
	"src/components/react/about/": "src/components/pages/company/",

	// Icons and utilities
	"src/components/react/icons.tsx": "src/components/ui/icons/index.tsx",
	"src/components/react/MarketCard.tsx":
		"src/components/sections/content-blocks/MarketCard.tsx",
};

// Import path updates
const IMPORT_UPDATES = {
	"@/components/react/": "@/components/",
	"@/components/astro/": "@/components/",
};

console.log("🚀 Starting component migration...\n");

// Step 1: Create new directory structure
function createDirectoryStructure() {
	console.log("📁 Creating new directory structure...");

	const directories = [
		"src/components/pages/product-catalog",
		"src/components/pages/knowledge-base",
		"src/components/pages/company",
		"src/components/pages/quote-request",
		"src/components/sections/hero",
		"src/components/sections/product-showcase",
		"src/components/sections/content-blocks",
		"src/components/sections/navigation",
		"src/components/sections/call-to-action",
		"src/components/forms/contact",
		"src/components/forms/quote-request",
		"src/components/forms/product-tools",
		"src/components/forms/event-registration",
		"src/components/data-display/product-tables",
		"src/components/data-display/search-results",
		"src/components/data-display/interactive-tools",
		"src/components/layout/header",
		"src/components/layout/footer",
		"src/components/layout/containers",
		"src/components/layout/backgrounds",
		"src/components/ui/buttons",
		"src/components/ui/inputs",
		"src/components/ui/feedback",
		"src/components/ui/cards",
		"src/components/ui/icons",
		"src/components/ui/typography",
	];

	for (const dir of directories) {
		try {
			mkdirSync(dir, { recursive: true });
			console.log(`  ✅ Created: ${dir}`);
		} catch (error) {
			console.log(`  ⚠️  Directory exists or error: ${dir}`);
		}
	}
}

// Step 2: Move components to new locations
function moveComponents() {
	console.log("\n📦 Moving components to new locations...");

	for (const [oldPath, newPath] of Object.entries(COMPONENT_MIGRATIONS)) {
		try {
			// Handle directory moves
			if (oldPath.endsWith("/")) {
				const files = glob.sync(`${oldPath}**/*.{tsx,ts,astro}`);
				for (const file of files) {
					const relativePath = file.replace(oldPath, "");
					const newFilePath = join(newPath, relativePath);

					// Ensure directory exists
					mkdirSync(dirname(newFilePath), { recursive: true });

					// Copy file
					copyFileSync(file, newFilePath);
					console.log(`  ✅ Moved: ${file} → ${newFilePath}`);
				}
			} else {
				// Handle single file moves
				// Ensure directory exists
				mkdirSync(dirname(newPath), { recursive: true });

				// Copy file
				copyFileSync(oldPath, newPath);
				console.log(`  ✅ Moved: ${oldPath} → ${newPath}`);
			}
		} catch (error) {
			console.log(`  ⚠️  Could not move ${oldPath}: ${error.message}`);
		}
	}
}

// Step 3: Update import paths in all files
function updateImportPaths() {
	console.log("\n🔗 Updating import paths...");

	const files = glob.sync("src/**/*.{tsx,ts,astro,mdx}");
	let updatedFiles = 0;

	for (const file of files) {
		try {
			const content = readFileSync(file, "utf-8");
			let newContent = content;
			let hasChanges = false;

			// Update import paths
			for (const [oldPattern, newPattern] of Object.entries(IMPORT_UPDATES)) {
				const regex = new RegExp(
					oldPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
					"g",
				);
				if (regex.test(newContent)) {
					newContent = newContent.replace(regex, newPattern);
					hasChanges = true;
				}
			}

			// Update specific component imports based on migrations
			for (const [oldPath, newPath] of Object.entries(COMPONENT_MIGRATIONS)) {
				if (!oldPath.endsWith("/")) {
					const oldImport = oldPath
						.replace("src/", "@/")
						.replace(".tsx", "")
						.replace(".ts", "");
					const newImport = newPath
						.replace("src/", "@/")
						.replace(".tsx", "")
						.replace(".ts", "");

					if (newContent.includes(oldImport)) {
						newContent = newContent.replace(
							new RegExp(oldImport, "g"),
							newImport,
						);
						hasChanges = true;
					}
				}
			}

			if (hasChanges) {
				writeFileSync(file, newContent);
				updatedFiles++;
				console.log(`  ✅ Updated imports in: ${file}`);
			}
		} catch (error) {
			console.log(`  ⚠️  Could not update ${file}: ${error.message}`);
		}
	}

	console.log(`\n📊 Updated imports in ${updatedFiles} files`);
}

// Step 4: Create index files for clean imports
function createIndexFiles() {
	console.log("\n📝 Creating index files...");

	const indexFiles = {
		"src/components/pages/index.ts": `// Page Components
export { ProductListingPage } from './product-catalog/ProductListingPage';
export { ProductDetailPage } from './product-catalog/ProductDetailPage';
export { RequestQuotePage } from './quote-request/RequestQuotePage';
`,
		"src/components/sections/index.ts": `// Section Components
export * from './hero';
export * from './product-showcase';
export * from './content-blocks';
export * from './navigation';
export * from './call-to-action';
`,
		"src/components/forms/index.ts": `// Form Components
export * from './contact';
export * from './quote-request';
export * from './product-tools';
export * from './event-registration';
`,
		"src/components/data-display/index.ts": `// Data Display Components
export * from './product-tables';
export * from './search-results';
export * from './interactive-tools';
`,
		"src/components/layout/index.ts": `// Layout Components
export * from './header';
export * from './footer';
export * from './containers';
export * from './backgrounds';
`,
		"src/components/ui/index.ts": `// UI Components
export * from './buttons';
export * from './inputs';
export * from './feedback';
export * from './cards';
export * from './icons';
export * from './typography';
`,
	};

	for (const [filePath, content] of Object.entries(indexFiles)) {
		try {
			mkdirSync(dirname(filePath), { recursive: true });
			writeFileSync(filePath, content);
			console.log(`  ✅ Created: ${filePath}`);
		} catch (error) {
			console.log(`  ⚠️  Could not create ${filePath}: ${error.message}`);
		}
	}
}

// Step 5: Create component documentation
function createComponentDocs() {
	console.log("\n📚 Creating component documentation...");

	const componentGuide = `# Component Usage Guide

## 🎯 Finding the Right Component

### I want to...

#### **Add/Edit a Product Page**
→ Look in: \`pages/product-catalog/\`
- \`ProductListingPage.tsx\` - Main product catalog
- \`ProductDetailPage.tsx\` - Individual product pages

#### **Update a Form**
→ Look in: \`forms/\`
- \`contact/\` - Contact forms
- \`quote-request/\` - Quote request forms
- \`product-tools/\` - Part number builders, calculators
- \`event-registration/\` - Event signup forms

#### **Modify Page Sections**
→ Look in: \`sections/\`
- \`hero/\` - Landing page banners
- \`product-showcase/\` - Product displays
- \`content-blocks/\` - Text/image sections
- \`call-to-action/\` - CTA sections

#### **Update Product Tables**
→ Look in: \`data-display/product-tables/\`
- \`WireSpecTable.tsx\` - Product specification tables
- \`ProductComparisonTable.tsx\` - Product comparisons

#### **Change Site Layout**
→ Look in: \`layout/\`
- \`header/\` - Site header and navigation
- \`footer/\` - Site footer
- \`containers/\` - Page layouts

## 🚨 Need Help?

If you can't find what you're looking for:
1. Check the file names - they describe what they do
2. Look at the directory structure - related items are grouped
3. Ask the development team
4. Check this guide for updates

## 📱 Contact Development Team

For component changes or questions:
- **Email**: dev-team@rubadue.com
- **Slack**: #development
- **Documentation**: Always check this guide first
`;

	writeFileSync("docs/COMPONENT_USAGE.md", componentGuide);
	console.log("  ✅ Created: docs/COMPONENT_USAGE.md");
}

// Main execution
async function main() {
	try {
		createDirectoryStructure();
		moveComponents();
		updateImportPaths();
		createIndexFiles();
		createComponentDocs();

		console.log("\n🎉 Component migration completed!");
		console.log("\n📋 Next steps:");
		console.log("1. Run `pnpm build` to verify everything works");
		console.log("2. Test key pages in development");
		console.log("3. Update any remaining import issues");
		console.log("4. Remove old component directories when confirmed working");
		console.log(
			"\n📚 Check docs/COMPONENT_USAGE.md for the new structure guide",
		);
	} catch (error) {
		console.error("❌ Migration failed:", error);
		process.exit(1);
	}
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	main();
}
