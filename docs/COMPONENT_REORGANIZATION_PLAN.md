# Component Reorganization Plan

## 🎯 Goal
Reorganize the component structure to be intuitive for non-technical users (marketers, content creators, business users) who need to:
- Add/edit products
- Update pages
- Manage forms and CTAs
- Modify layouts and content sections

## 📁 Proposed New Structure

```
src/components/
├── 📄 pages/                    # Complete page components
│   ├── product-catalog/         # Product listing and detail pages
│   │   ├── ProductListingPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   └── ProductSearchPage.tsx
│   ├── knowledge-base/          # Blog/article pages
│   │   ├── ArticlePage.tsx
│   │   └── ArticleListPage.tsx
│   ├── company/                 # About, team, company pages
│   │   ├── AboutPage.tsx
│   │   ├── TeamPage.tsx
│   │   └── TimelinePage.tsx
│   └── quote-request/           # Quote and contact pages
│       ├── RequestQuotePage.tsx
│       └── ThankYouPage.tsx
│
├── 🧩 sections/                 # Reusable page sections
│   ├── hero/                    # Landing page heroes
│   │   ├── MainHero.tsx
│   │   ├── ProductHero.tsx
│   │   └── PageHero.tsx
│   ├── product-showcase/        # Product display sections
│   │   ├── ProductGrid.tsx
│   │   ├── ProductCarousel.tsx
│   │   ├── ProductComparison.tsx
│   │   └── ProductSpecTable.tsx
│   ├── content-blocks/          # Content sections
│   │   ├── TextImageBlock.tsx
│   │   ├── FeatureList.tsx
│   │   ├── TestimonialBlock.tsx
│   │   └── FAQSection.tsx
│   ├── navigation/              # Navigation components
│   │   ├── MainNavigation.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── SiteSearch.tsx
│   │   └── MobileMenu.tsx
│   └── call-to-action/          # CTA sections
│       ├── ContactCTA.tsx
│       ├── QuoteCTA.tsx
│       └── NewsletterSignup.tsx
│
├── 📝 forms/                    # All interactive forms
│   ├── contact/                 # Contact forms
│   │   ├── ContactForm.tsx
│   │   └── QuickContactForm.tsx
│   ├── quote-request/           # Quote request forms
│   │   ├── QuoteRequestForm.tsx
│   │   ├── LitzWireQuoteForm.tsx
│   │   └── InsulatedWireQuoteForm.tsx
│   ├── product-tools/           # Product configuration tools
│   │   ├── PartNumberBuilder.tsx
│   │   ├── N1MaxCalculator.tsx
│   │   └── ProductSelector.tsx
│   └── event-registration/      # Event forms (PCIM, etc.)
│       └── PCIMRegistrationForm.tsx
│
├── 📊 data-display/             # Data tables and visualization
│   ├── product-tables/          # Product specification tables
│   │   ├── WireSpecTable.tsx
│   │   ├── ProductComparisonTable.tsx
│   │   └── table-components/    # Shared table UI
│   ├── search-results/          # Search and filtering
│   │   ├── ProductSearch.tsx
│   │   ├── SearchFilters.tsx
│   │   └── SearchPagination.tsx
│   └── interactive-tools/       # Interactive elements
│       ├── ProductConfigurator.tsx
│       ├── WorldMap.tsx
│       └── TechnicalGlossary.tsx
│
├── 🎨 layout/                   # Site-wide layout components
│   ├── header/                  # Site header
│   │   ├── SiteHeader.tsx
│   │   └── HeaderNavigation.tsx
│   ├── footer/                  # Site footer
│   │   ├── SiteFooter.tsx
│   │   └── FooterLinks.tsx
│   ├── containers/              # Layout containers
│   │   ├── PageContainer.tsx
│   │   ├── ContentContainer.tsx
│   │   └── SectionContainer.tsx
│   └── backgrounds/             # Background elements
│       └── WaveBackground.tsx
│
└── 🔧 ui/                       # Basic UI building blocks
    ├── buttons/                 # Button variants
    ├── inputs/                  # Form inputs
    ├── feedback/                # Alerts, toasts, loading
    ├── cards/                   # Card components
    ├── icons/                   # Icon components
    └── typography/              # Text components
```

## 🎯 Business-Oriented Organization Benefits

### For Content Creators
- **Clear path to find page components**: `pages/product-catalog/` → `sections/product-showcase/`
- **Easy form management**: All forms in one place, organized by purpose
- **Obvious content sections**: `sections/content-blocks/` for reusable content

### For Marketers
- **CTA management**: All call-to-action components in `sections/call-to-action/`
- **Hero sections**: Easy to find and update in `sections/hero/`
- **Product showcasing**: Clear product display options in `sections/product-showcase/`

### For Product Managers
- **Product tools**: All product-related tools in `forms/product-tools/`
- **Product tables**: All specification displays in `data-display/product-tables/`
- **Product pages**: All product-related pages in `pages/product-catalog/`

## 📋 Migration Plan

### Phase 1: Create New Structure
1. Create new directory structure
2. Move components to new locations
3. Update all import paths
4. Test build

### Phase 2: Improve Naming
1. Rename components to be more descriptive
2. Ensure consistent naming conventions
3. Add JSDoc comments for clarity

### Phase 3: Create Component Guide
1. Document each component's purpose
2. Create usage examples
3. Add screenshots/previews

## 🏷️ Naming Conventions

### Component Names
- **PascalCase**: `ProductSpecTable.tsx`
- **Descriptive**: What it does, not how it works
- **Specific**: `QuoteRequestForm` not `Form`
- **Consistent**: Similar components follow same pattern

### Directory Names
- **kebab-case**: `product-catalog/`
- **Business terms**: Use language marketers understand
- **Logical grouping**: Related functionality together

### File Organization
```
ComponentName/
├── ComponentName.tsx        # Main component
├── ComponentName.test.tsx   # Tests
├── ComponentName.stories.tsx # Storybook
├── types.ts                 # Component-specific types
├── utils.ts                 # Component-specific utilities
└── index.ts                 # Clean exports
```

## 🎨 Documentation for Non-Technical Users

### Component Catalog
Create a visual guide showing:
- **Screenshot** of each component
- **Purpose** in business terms
- **When to use** it
- **How to customize** common properties

### Quick Reference Cards
```markdown
## 📊 Product Specification Table
**File**: `data-display/product-tables/WireSpecTable.tsx`
**Purpose**: Display wire specifications in a searchable table
**Used on**: Product detail pages
**Customizable**: Columns, filtering, pagination
**Contact**: Development team for changes
```

## 🔄 Migration Commands

### Automated Migration Script
```bash
# Run the component migration script
pnpm run migrate:components

# Update all import paths
pnpm run update:imports

# Verify build after migration
pnpm build
```

### Manual Updates Required
- Update any hardcoded paths in content files
- Update component documentation
- Update Storybook stories
- Update any external references

## ✅ Success Metrics

### For Non-Technical Users
- [ ] Can find product page components in under 30 seconds
- [ ] Can identify the right form component for their needs
- [ ] Can understand component purpose from name/location
- [ ] Can find CTA components without help

### For Development Team
- [ ] Import paths are logical and consistent
- [ ] Related components are co-located
- [ ] Build time doesn't increase
- [ ] All tests pass after migration

## 📚 Related Documentation
- [Content Guidelines](./CONTENT_GUIDELINES.md)
- [Component Usage Guide](./COMPONENT_USAGE.md) *(to be created)*
- [Quick Start Guide](./QUICK_START_GUIDE.md) 