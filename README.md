# Rubadue Wire Website Documentation

> 🚀 **Quick Start**: New to this project? Jump to [Setup for Beginners](#setup-for-beginners) to get started in minutes!

Welcome to the Rubadue Wire website documentation. This guide will help you understand how to set up the development environment, add content, and make changes to the website..

## 📋 Table of Contents

1. [🚀 Setup for Beginners](#setup-for-beginners)
2. [📁 Component Architecture](#component-architecture)
3. [⚙️ Development Environment Setup](#development-environment-setup)
4. [📝 Content Management](#content-management)
5. [📊 Data Tables](#data-tables)
6. [🔄 Making Changes](#making-changes)
7. [🚀 Deployment & Monitoring](#deployment--monitoring)
8. [📖 Additional Documentation](#additional-documentation)
9. [❓ Troubleshooting](#troubleshooting)

---

## Setup for Beginners

**New to GitHub and web development?** Follow this simplified guide:

### ✅ Quick Checklist
- [ ] Create GitHub account
- [ ] Get repository access
- [ ] Download GitHub Desktop
- [ ] Download VS Code
- [ ] Clone the project
- [ ] Start coding!

### 📋 Step-by-Step Guide

1. **Create Accounts & Get Access**
   - Create account at [github.com](https://github.com/)
   - Ask your admin to invite you to the project

2. **Install Software** (one-time setup)
   - Download [GitHub Desktop](https://desktop.github.com/)
   - Download [VS Code](https://code.visualstudio.com/)
   - Download [Node.js](https://nodejs.org/) (choose LTS version)

3. **Get the Project**
   - Open GitHub Desktop → Clone repository
   - Find your project and clone it

4. **Start Working**
   - Open project in VS Code
   - Open terminal and run: `npm install -g pnpm` then `pnpm install`
   - Run: `pnpm dev`
   - Open browser to `http://localhost:4321`

🎉 **You're ready!** Jump to [Content Management](#content-management) to start adding content.

### 🖥️ Never Used a Terminal Before?

**Don't panic!** Here are the only commands you need to know:

```bash
# See where you are
pwd

# See what files are here  
ls          # Mac/Linux
dir         # Windows

# Go into a folder
cd foldername

# Go back up one level
cd ..

# Project commands (the important ones!)
pnpm install    # Set up the project (run once)
pnpm dev        # Start working (run every time)
Ctrl+C          # Stop the server when done
```

**💡 Pro Tips:**
- Press `Tab` while typing folder names - it will complete them for you!
- Press the up arrow to see previous commands
- If you get lost, type `pwd` to see where you are

For complete terminal guidance, see [Basic Terminal Commands](./docs/TROUBLESHOOTING.md#basic-terminal-commands-for-beginners).

---

## Getting Started

This website is built using [Astro](https://astro.build/), a modern web framework that allows for fast, content-focused websites. 

### What You Can Do
- ✍️ **Knowledge Base Articles** - Technical guides and educational content
- 📊 **Product Catalog** - Detailed product specifications and data tables
- 🔧 **Interactive Components** - Forms, product builders, and data tables
- 📁 **Static Assets** - Images, certificates, and downloadable content

### Code Quality Tools
The project uses modern development tools for consistent code quality:
- **[Biome](https://biomejs.dev/)** - Fast formatter and linter (replaces Prettier + ESLint)
- **[Knip](https://knip.dev/)** - Finds unused dependencies and exports
- **TypeScript** - Type checking for better code reliability

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

#### First Time Setup with GitHub

If you're new to GitHub, follow these steps first:

1. **Create a GitHub Account**
   - Go to [github.com](https://github.com/)
   - Click "Sign up" and create your free account
   - Verify your email address

2. **Get Access to the Repository**
   - Contact your team administrator to be added to the project repository
   - You'll receive an invitation email to join the repository

#### Required Software

**📝 Start Here for Beginners**: Install these in order for the smoothest experience.

1. **Visual Studio Code** (Code Editor with Built-in Terminal)
   - Download from [code.visualstudio.com](https://code.visualstudio.com/)
   - **Why first?** VS Code has a user-friendly built-in terminal, so you won't need to find your system's terminal
   - Install the following extensions (VS Code will suggest these automatically):
     - Astro (astro-build.astro-vscode)
     - MDX (unifiedjs.vscode-mdx)
     - Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)
     - Biome (biomejs.biome) - for formatting and linting

2. **Node.js** (version 18.x - REQUIRED)
   - **Important**: This project requires Node.js 18. Using other versions may cause deployment failures.
   
   **Installation Options** (choose the one that fits your comfort level):
   
   - **🔰 For Beginners**: 
     - Download Node.js 18 LTS from [nodejs.org](https://nodejs.org/)
     - Run the installer (you may need administrator/admin privileges)
     - **Windows users**: Right-click the installer and "Run as administrator"
     - **Mac users**: You may be prompted for your password during installation
   
   - **📦 For Developers (using package managers)**:
     - **macOS**: Open Terminal and run: `brew install node@18`
     - **Windows**: Open PowerShell as Administrator and run: `scoop install nodejs18`
     - **Linux**: `curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs`
   
   - **🔄 For Multiple Projects (Node Version Manager)**:
     ```bash
     # Install nvm first, then in your terminal:
     nvm install 18
     nvm use 18
     # Or use the project's .nvmrc file:
     nvm use  # This reads the .nvmrc file in the project root
     ```
   
   - This includes npm (Node Package Manager)

3. **pnpm** (Package Manager)
   - **After installing Node.js**, open VS Code
   - Open the built-in terminal: `Terminal` menu → `New Terminal` (or `Ctrl+`` ` on Windows/Linux, `Cmd+`` ` on Mac)
   - Type: `npm install -g pnpm` and press Enter
   - **If you get permission errors**:
     - **Windows**: Close VS Code, right-click VS Code icon, "Run as administrator", then try again
     - **Mac/Linux**: Try `sudo npm install -g pnpm` (you'll be asked for your password)

4. **GitHub Account** (Version Control)
   - Create a free account at [github.com](https://github.com/)
   - This is needed to access the repository and manage code changes

5. **GitHub Desktop** (Recommended - Easy Git Management)
   - Download from [desktop.github.com](https://desktop.github.com/)
   - This provides a user-friendly interface for managing code changes
   - **Alternative**: You can use command-line Git if you prefer (download from [git-scm.com](https://git-scm.com/))

### Setting Up the Project

#### Option 1: Using GitHub Desktop (Recommended for Beginners)

1. **Clone the Repository**
   - Open GitHub Desktop
   - Click "Clone a repository from the Internet"
   - Enter the repository URL or search for it
   - Choose a local folder where you want to store the project
   - Click "Clone"

2. **Open Project in VS Code**
   - In GitHub Desktop, click "Open in Visual Studio Code" 
   - Or navigate to the project folder and open it in VS Code

3. **Install Dependencies**
   - Open the terminal in VS Code (Terminal > New Terminal)
   - Run: `pnpm install`

4. **Start Development Server**
   - In the terminal, run: `pnpm dev`
   - The website will be available at `http://localhost:4321`
   - Changes you make will automatically refresh the browser

#### Option 2: Using Command Line

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

#### Verify Setup
- Open your browser and go to `http://localhost:4321`
- You should see the Rubadue Wire website

## Content Management

> 💡 **Most Common Tasks**: Adding articles and updating product info. Start here if you're ready to add content!

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
heroImage: "@/assets/backgrounds/knowledge-base-hero-placeholder.webp"
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

- `heroImage`: Path to header image (use `@/assets/backgrounds/` for optimized images)
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

1. **Hero Images**: Place in `src/assets/backgrounds/` (optimized by Astro)
2. **Product Images**: Place in `src/assets/products/[category]/` (optimized by Astro)
3. **General Content Images**: Place in `src/assets/images/` (optimized by Astro)
4. **Static Assets**: Only use `public/` for files that shouldn't be processed

#### Image Guidelines

- Use `.webp` format when possible for better performance
- Optimize images before adding (keep file sizes reasonable)
- Use descriptive filenames
- Maintain consistent naming conventions

#### Referencing Images

- **Optimized images (recommended)**: `@/assets/path/filename.webp`
- **Hero images**: `@/assets/backgrounds/filename.webp`
- **Product images**: `@/assets/products/category/filename.webp`
- **Static files (avoid unless necessary)**: `/filename.webp` (public folder)

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

> ⚡ **Quick Workflow**: Edit files → Save → Check GitHub Desktop → Commit → Push → Check Vercel

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

4. **Code Quality Checks** (Optional but recommended)
   ```bash
   pnpm lint        # Check for code issues
   pnpm format      # Format code with Biome
   pnpm unused      # Check for unused dependencies
   ```

5. **Build for Production** (Optional - test before deployment)
   ```bash
   pnpm build
   pnpm preview
   ```

### Git Workflow (Version Control)

#### Using GitHub Desktop (Recommended)

1. **Review Your Changes**
   - Open GitHub Desktop
   - You'll see all modified files listed on the left
   - Click on files to review what changed (green = added, red = removed)

2. **Commit Your Changes**
   - Write a descriptive summary in the "Summary" field (e.g., "Add new knowledge base article about wire insulation")
   - Optionally add a longer description in the "Description" field
   - Click "Commit to main" (or your current branch)

3. **Push to Repository**
   - Click "Push origin" to upload your changes to GitHub
   - Your changes will be automatically deployed

#### Using Command Line (Alternative)

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

## Deployment & Monitoring

The website is automatically deployed when changes are pushed to the main branch. The deployment process:

1. Push changes to Git repository
2. Vercel automatically detects changes
3. Builds and deploys the updated website
4. Updates are live within a few minutes

### Monitoring Deployments with Vercel Dashboard

The Vercel dashboard provides valuable insights into your deployments and website performance. Here's how to use it effectively:

#### Accessing the Dashboard

1. **Get Access to Vercel**
   - Contact your team administrator to be invited to the Vercel project
   - You'll receive an invitation email to join the team
   - Create a Vercel account if you don't have one

2. **Navigate to Your Project**
   - Go to [vercel.com](https://vercel.com/) and sign in
   - Click on the Rubadue Wire project from your dashboard
   - You'll see the project overview with recent deployments

#### Key Dashboard Features

**Deployments Tab**
- **Status Overview**: See if your latest changes deployed successfully (green checkmark) or failed (red X)
- **Deployment History**: View all previous deployments with timestamps
- **Build Logs**: Click on any deployment to see detailed build information
- **Preview URLs**: Each deployment gets a unique URL for testing before going live

**Functions Tab**
- Monitor serverless functions (if any)
- View function logs and performance metrics

**Analytics Tab** (if enabled)
- Website traffic and performance data
- Page views and user interactions
- Core Web Vitals scores

#### When to Use the Dashboard

**After Making Changes:**
- Check that your deployment completed successfully
- Verify the build didn't encounter any errors
- Test your changes using the preview URL before they go live

**Troubleshooting Issues:**
- **Build Failures**: Check build logs for error messages
- **Missing Content**: Verify files were properly committed and pushed
- **Performance Issues**: Review analytics and Core Web Vitals
- **Broken Links/Images**: Check deployment logs for 404 errors

**Regular Monitoring:**
- Weekly check on website performance
- Monitor for any unexpected build failures
- Review analytics for content performance insights

#### Understanding Deployment Status

- **✅ Ready**: Deployment successful, changes are live
- **🔄 Building**: Currently deploying your changes
- **❌ Error**: Build failed, check logs for details
- **⏸️ Canceled**: Deployment was stopped (usually due to a newer deployment)

#### Common Issues and Solutions

**Build Failed:**
1. Click on the failed deployment
2. Review the build logs for error messages
3. Common fixes:
   - Check for typos in frontmatter (YAML syntax)
   - Verify all referenced images exist
   - Ensure all imported components are properly defined

**Content Not Updating:**
1. Check if deployment completed successfully
2. Try a hard refresh in your browser (Ctrl+F5 or Cmd+Shift+R)
3. Verify changes were actually committed and pushed to GitHub

**Slow Performance:**
1. Check Core Web Vitals in the Analytics tab
2. Review large images that might need optimization
3. Monitor function execution times if applicable

#### Best Practices

- **Check After Each Push**: Always verify your deployment succeeded
- **Use Preview URLs**: Test changes before they go live to production
- **Monitor Build Times**: Unusually long builds might indicate issues
- **Review Error Logs**: Don't ignore failed deployments - investigate and fix issues promptly
- **Set Up Notifications**: Enable email/Slack notifications for deployment status (ask your admin)

#### Getting Help

If you encounter persistent deployment issues:

1. **Screenshot the Error**: Capture build logs and error messages
2. **Note the Deployment ID**: Found in the URL when viewing a specific deployment
3. **Document Steps**: What changes were made before the issue occurred
4. **Contact Support**: Share this information with your development team

The Vercel dashboard is your best tool for ensuring content changes deploy successfully and monitoring the overall health of the website.

## Additional Documentation

For comprehensive guides and detailed information:

- 📁 **[Documentation Index](./docs/README.md)** - Navigate all project documentation
- 🆘 **[Complete Troubleshooting Guide](./docs/TROUBLESHOOTING.md)** - Solutions to all common issues 
- 📝 **[Content Guidelines](./docs/CONTENT_GUIDELINES.md)** - Writing standards, SEO best practices, formatting
- 🔧 **[Data Tables Guide](./docs/DATA_TABLES.md)** - Complete data table documentation  

> 💡 **Pro tip**: Start with the [docs index](./docs/README.md) to quickly find what you need!

## Troubleshooting

> 🚨 **Need Help Fast?** Check the [Complete Troubleshooting Guide](./docs/TROUBLESHOOTING.md) for detailed solutions to all common issues.

### Quick Emergency Commands
```bash
# If everything breaks, try this:
rm -rf node_modules && pnpm install && pnpm dev

# Fix code formatting:
pnpm format && pnpm lint
```

### Most Common Issues

**"Command not found: node" or "pnpm"**
- Install Node.js 18 from [nodejs.org](https://nodejs.org/)
- Run `npm install -g pnpm`
- Restart VS Code

**"Port 4321 already in use"**
- Press `Ctrl+C` to stop the current server
- Or try: `pnpm dev --port 3000`

**Changes not showing in browser**
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Make sure you saved the file
- Check if the dev server is still running

**Images not loading**
- Check image paths: use `@/assets/images/filename.webp`
- Make sure images are in `src/assets/` directory
- Verify filename matches exactly (case-sensitive)

### Getting Help

**Before asking for help:**
1. Check the [Complete Troubleshooting Guide](./docs/TROUBLESHOOTING.md)
2. Try the emergency commands above
3. Copy the exact error message

**When asking for help, include:**
- What you were trying to do
- The exact error message (copy and paste)
- Screenshots if helpful
- What you already tried

For comprehensive troubleshooting covering setup issues, content problems, deployment failures, and more, see the **[Complete Troubleshooting Guide](./docs/TROUBLESHOOTING.md)**.

## Next Steps

After setting up your environment:

1. Practice adding a test knowledge base article
2. Try adding a test product
3. Familiarize yourself with the existing content structure
4. Review the component library for advanced features

---

## 📋 Quick Reference Card

### 🚀 Daily Workflow
```bash
# Start working
pnpm dev

# After making changes
# 1. Save files in VS Code
# 2. Open GitHub Desktop
# 3. Review changes → Commit → Push
# 4. Check Vercel dashboard
```

### 📝 Content Files Locations
- **Articles**: `src/content/knowledgeBase/filename.md`
- **Products**: `src/content/products/category/filename.mdx`
- **Images**: `src/assets/` (optimized) or `public/` (static)

### 🔗 Important Links
- **Local Site**: `http://localhost:4321`
- **GitHub Desktop**: GitHub Desktop app
- **Vercel Dashboard**: `vercel.com/your-project`

### 🆘 Emergency Commands
```bash
# Server won't start?
rm -rf node_modules && pnpm install

# Need to restart?
Ctrl+C then pnpm dev

# Code formatting issues?
pnpm format

# Check for errors?
pnpm lint
```

---

**Need Help?** Check the [Complete Troubleshooting Guide](./docs/TROUBLESHOOTING.md) or contact your development team with screenshots and error messages.
