# Rubadue Wire Website Documentation

Welcome to the Rubadue Wire website documentation. This guide will help you understand how to set up the development environment, add content, and make changes to the website.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Component Architecture](#component-architecture)
3. [Development Environment Setup](#development-environment-setup)
4. [Content Management](#content-management)
5. [Data Tables](#data-tables)
6. [Making Changes](#making-changes)
7. [Deployment](#deployment)
8. [Documentation](#documentation)
9. [Troubleshooting](#troubleshooting)

## Getting Started

This website is built using [Astro](https://astro.build/), a modern web framework that allows for fast, content-focused websites. The site includes:

- **Knowledge Base Articles** - Technical guides and educational content
- **Product Catalog** - Detailed product specifications and data tables
- **Interactive Components** - Forms, product builders, and data tables
- **Static Assets** - Images, certificates, and downloadable content

## Component Architecture

The website uses a organized component structure:

```
src/components/
├── pages/          # Complete page components (ProductListingPage, etc.)
├── forms/          # All form components (contact, quote-request, product-tools)
├── sections/       # Content sections & blocks (product-showcase, content-blocks)
├── data-display/   # Tables, search, interactive tools (product-tables, search-results)
├── ui/            # Base UI components (buttons, cards, inputs, etc.)
└── layout/        # Layout & container components (header, footer, containers)
```

## Development Environment Setup

### Prerequisites

Before you begin, you'll need to install the following software on your computer:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - This includes npm (Node Package Manager)

2. **pnpm** (Package Manager)
   - After installing Node.js, open your terminal/command prompt
   - Run: `npm install -g pnpm`

3. **Git** (Version Control)
   - Download from [git-scm.com](https://git-scm.com/)
   - This is needed to download and manage code changes

4. **Visual Studio Code** (Recommended Code Editor)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)
   - Install the following extensions:
     - Astro
     - Tailwind CSS IntelliSense
     - Auto Rename Tag
     - Prettier - Code formatter

### Setting Up the Project

1. **Clone the Repository**
   ```bash
   git clone [your-repository-url]
   cd rubadue-astro
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development Server**
   ```bash
   pnpm dev
   ```
   - The website will be available at `http://localhost:4321`
   - Changes you make will automatically refresh the browser

4. **Verify Setup**
   - Open your browser and go to `http://localhost:4321`
   - You should see the Rubadue Wire website

## Content Management

### Adding Knowledge Base Articles

Knowledge base articles are located in `src/content/knowledgeBase/` and use Markdown format.

#### Creating a New Article

1. Create a new `.md` file in `src/content/knowledgeBase/`
2. Use kebab-case naming (e.g., `new-article-title.md`)
3. Start with the required frontmatter:

```markdown
---
title: "Your Article Title"
description: "Brief description of the article content"
pubDate: "2024-01-15"
heroImage: "/images/knowledge-base-hero-placeholder.webp"
tags: ["Technical Guide", "Wire Types", "Applications"]
---

Your article content goes here using standard Markdown formatting.

## Section Headers

Use ## for main sections and ### for subsections.

### Subsection Example

- Bullet points
- Are supported
- Along with numbered lists

1. First item
2. Second item
3. Third item

**Bold text** and *italic text* are supported.

[Links](https://example.com) can be added.

| Tables | Are | Supported |
|--------|-----|-----------|
| Data   | Can | Be Added  |
```

#### Required Fields

- `title`: The main heading for your article
- `description`: Brief summary (appears in search results and previews)
- `pubDate`: Publication date in YYYY-MM-DD format
- `tags`: Array of relevant keywords for categorization

#### Optional Fields

- `heroImage`: Path to header image (use `/images/` for public images)
- `updatedDate`: If you update an existing article

### Adding Products

Products are located in `src/content/products/` and organized by category.

#### Product Structure

```
src/content/products/
├── single-insulated/
│   ├── fep/
│   ├── pfa/
│   ├── etfe/
│   └── tca1/
├── double-insulated/
├── triple-insulated/
└── litz-wire/
```

#### Creating a New Product

1. Navigate to the appropriate category folder
2. Create a new `.mdx` file (note: `.mdx` not `.md`)
3. Use the following template:

```markdown
---
title: "Product Name"
description: "Product description for SEO and previews"
pubDate: "2024-01-15"
heroImage: "@/assets/products/category/product-image.webp"

tags:
  type: ["Single Insulated"]    # First element becomes primary category
  material: ["FEP"]             # Material classification

construction:
  sizeRange: "22 AWG - 40 AWG"
  conductor: "Tin plated copper"
  insulation: "FEP"
  rating:
    temperature: "155°C"
    voltage: ["600 Vpk"]

applications:
  - "Telecom/Electronic"
  - "Basic isolation applications"

compliances:
  - "UL OBJT2 File No. E206198"
  - "RoHS Compliant"

systemApprovals:
  - "UL 1446"

tensileStrength: "3000 psi"
breakdown: "Approx. 3000 V"
---

import { YourProductTable } from "@/components/react/data-table/path/to/table";

<YourProductTable client:load />
```

#### Important Product Fields

- **Required**: `title`, `description`, `pubDate`, `tags.type`, `tags.material`
- **Construction**: Detailed specifications
- **Applications**: Use cases for the product
- **Compliances**: Certifications and standards
- **Table Component**: Import the appropriate data table component

**Tags Notes:**
- The first element in `tags.type` becomes the primary category (shown in page headers)
- For Litz Wire products: `type: ["Litz Wire", "Triple Insulated"]`  
- For regular wire: `type: ["Single Insulated"]`
- Available materials: `"ETFE"`, `"FEP"`, `"PFA"`, `"TCA1"`, `"TCA2"`, `"TCA3"`

### Managing Images

#### Adding Images

1. **Knowledge Base Images**: Place in `public/images/`
2. **Product Images**: Place in `src/assets/products/[category]/`
3. **General Images**: Place in `public/` or `src/assets/`

#### Image Guidelines

- Use `.webp` format when possible for better performance
- Optimize images before adding (keep file sizes reasonable)
- Use descriptive filenames
- Maintain consistent naming conventions

#### Referencing Images

- Public images: `/images/filename.webp`
- Asset images: `@/assets/path/filename.webp`

## Data Tables

Product pages include interactive data tables that display technical specifications. These tables are searchable, sortable, and paginated for easy navigation.

### Quick Overview

Data tables are React components that display product specifications such as:
- Part numbers and AWG sizes
- Conductor and insulation dimensions
- Weight and performance data
- Compliance and certification information

### Working with Data Tables

For detailed information about creating and managing data tables, see the [Data Tables Documentation](./docs/DATA_TABLES.md).

#### Common Tasks

**Adding new product data:**
1. Locate the appropriate data table directory
2. Update the `data.ts` file with new specifications
3. Test the changes locally

**Creating new data tables:**
1. Follow the established directory structure
2. Create data, columns, and table component files
3. Import the table component into your product page

**Modifying existing tables:**
1. Update product specifications in the data file
2. Adjust table behavior through component props
3. Verify changes don't break existing functionality

### Important Notes

- Always include the `client:load` directive when using tables in `.mdx` files
- Maintain consistent data formatting across similar products
- Test table performance with large datasets
- Verify all technical specifications with engineering

For comprehensive guidance on data tables, refer to the [complete documentation](./docs/DATA_TABLES.md).

## Making Changes

### Development Workflow

1. **Start Development Server**
   ```bash
   pnpm dev
   ```

2. **Make Your Changes**
   - Edit content files in `src/content/`
   - Add images to appropriate directories
   - Save your changes

3. **Preview Changes**
   - Check `http://localhost:4321` in your browser
   - Navigate to your new/edited content
   - Verify everything looks correct

4. **Build for Production** (Optional - test before deployment)
   ```bash
   pnpm build
   pnpm preview
   ```

### Git Workflow (Version Control)

1. **Check Status**
   ```bash
   git status
   ```

2. **Add Changes**
   ```bash
   git add .
   ```

3. **Commit Changes**
   ```bash
   git commit -m "Add new knowledge base article about wire insulation"
   ```

4. **Push to Repository**
   ```bash
   git push
   ```

### Best Practices

- **Test Locally**: Always preview changes before pushing
- **Descriptive Commits**: Use clear commit messages
- **Regular Backups**: Commit and push changes regularly
- **Image Optimization**: Compress images before adding them

## Deployment

The website is automatically deployed when changes are pushed to the main branch. The deployment process:

1. Push changes to Git repository
2. Vercel automatically detects changes
3. Builds and deploys the updated website
4. Updates are live within a few minutes

## Documentation

Additional documentation for content creators:

- **[Content Guidelines](./docs/CONTENT_GUIDELINES.md)** - Detailed writing standards, SEO best practices, and formatting guidelines
- **[Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** - Solutions to common issues and errors

## Troubleshooting

### Common Issues

#### Development Server Won't Start
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
pnpm dev
```

#### Images Not Loading
- Check file paths are correct
- Ensure images are in the right directory
- Verify image file extensions match references

#### Content Not Appearing
- Check frontmatter syntax (YAML formatting)
- Ensure required fields are present
- Verify file is in correct directory

#### Build Errors
- Check console for specific error messages
- Ensure all imports are correct
- Verify all referenced components exist

### Getting Help

If you encounter issues:

1. Check the error message in your terminal
2. Verify your file structure matches the examples
3. Ensure all required fields are present in frontmatter
4. Check that image paths are correct

For additional support, contact your development team with:
- Description of the issue
- Error messages (if any)
- Steps you were taking when the issue occurred
- Screenshots if helpful

## Next Steps

After setting up your environment:

1. Practice adding a test knowledge base article
2. Try adding a test product
3. Familiarize yourself with the existing content structure
4. Review the component library for advanced features

---

**Note**: This documentation covers the essential tasks for content management. For advanced customization or technical modifications, please consult with your development team.