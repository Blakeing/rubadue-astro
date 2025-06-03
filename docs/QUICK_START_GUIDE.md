# Quick Start Guide

This guide will help you get the Rubadue Wire website running locally in under 15 minutes.

## Prerequisites (5 minutes)

Install these in order:

1. **Node.js**: Download from [nodejs.org](https://nodejs.org/) (choose LTS version)
2. **pnpm**: Open terminal and run `npm install -g pnpm`
3. **Git**: Download from [git-scm.com](https://git-scm.com/)
4. **VS Code**: Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Setup (5 minutes)

1. **Get the Code**
   ```bash
   git clone [your-repository-url]
   cd rubadue-astro
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development**
   ```bash
   pnpm dev
   ```

4. **View Website**
   - Open browser to `http://localhost:4321`
   - You should see the Rubadue Wire website

## Adding Content (5 minutes)

### Quick Knowledge Base Article

1. Create `src/content/knowledgeBase/test-article.md`
2. Add this content:

```markdown
---
title: "Test Article"
description: "This is a test article to verify setup"
pubDate: "2024-01-15"
tags: ["Test"]
---

# Test Article

This article confirms your setup is working correctly.

## Features

- Markdown formatting works
- **Bold text** is supported
- Links work: [Rubadue Wire](https://rubadue.com)

## Next Steps

Now you can start adding real content!
```

3. Save and visit `http://localhost:4321/knowledge-base/test-article`

### Quick Product Addition

1. Create `src/content/products/single-insulated/test-product.mdx`
2. Add this content:

```markdown
---
title: "Test Product"
description: "Test product to verify setup"
pubDate: "2024-01-15"
category: "Single Insulated"
construction:
  conductor: "Copper"
  insulation: "Test Material"
applications:
  - "Testing"
---

# Test Product

This product confirms your setup is working.
```

3. Save and visit the products catalog to see your test product

## Making Changes

1. **Edit Files**: Make changes to `.md` or `.mdx` files
2. **See Changes**: Browser refreshes automatically
3. **Save Work**: Use Git to save your changes

```bash
git add .
git commit -m "Added test content"
git push
```

## Common Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Check Git status
git status

# Save changes
git add .
git commit -m "Describe your changes"
git push
```

## Getting Help

If something doesn't work:

1. Check that Node.js is installed: `node --version`
2. Check that pnpm is installed: `pnpm --version`
3. Try reinstalling dependencies: `rm -rf node_modules && pnpm install`
4. Check for error messages in the terminal

## Next Steps

Once you're up and running:

1. Read the full [README.md](../README.md) for detailed instructions
2. Review [Content Guidelines](./CONTENT_GUIDELINES.md) for writing standards
3. Practice adding real knowledge base articles and products
4. Explore the existing content structure

---

**Success?** You should now have a working development environment and understand the basics of adding content. The full documentation provides much more detail for when you're ready to dive deeper. 