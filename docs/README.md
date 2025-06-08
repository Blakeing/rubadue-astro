# Rubadue Wire Website - Content Contributor Guide

Welcome! This guide is designed for **content creators, marketers, and subject matter experts** who want to contribute to the Rubadue Wire website without needing extensive coding knowledge.

## 🚀 Getting Started

### New to Contributing Content?
1. **[Setup Guide](./QUICK_START_GUIDE.md)** - Step-by-step instructions to get your development environment running (15 minutes)
2. **[Content Guidelines](./CONTENT_GUIDELINES.md)** - How to write and format content for the website
3. **[Troubleshooting](./TROUBLESHOOTING.md)** - Solutions to common issues

### What You Can Do
- ✅ **Add Knowledge Base Articles** - Technical guides, application notes, educational content
- ✅ **Add New Products** - Product descriptions, specifications, applications
- ✅ **Edit Existing Content** - Update information, fix typos, improve descriptions
- ✅ **Add Images** - Product photos, diagrams, charts

### What This Site Uses
The website is built with **Astro** and uses **Markdown** files for content. Don't worry if you're not familiar with these - the guides will walk you through everything step by step.

## 📝 Content Types

### Knowledge Base Articles
Located in: `src/content/knowledgeBase/your-article.md`

**Best for:**
- Technical guides and tutorials
- Application notes and case studies  
- Educational content about wire and cable
- Industry insights and best practices

### Product Pages
Located in: `src/content/products/category/your-product.mdx`

**Best for:**
- Individual product descriptions
- Technical specifications
- Application examples
- Construction details

## 🔧 Quick Commands

Once you have everything set up (see Setup Guide):

```bash
# Start the development server (lets you see changes in real-time)
pnpm dev

# Save your changes to Git
git add .
git commit -m "Describe what you changed"
git push
```

## 📋 Typical Workflow

1. **Start Development Server**: `pnpm dev`
2. **Create or Edit Content**: Add/modify `.md` or `.mdx` files
3. **Preview Changes**: Check `http://localhost:4321` in your browser
4. **Save Changes**: Use Git commands to save your work
5. **Push Changes**: Upload your changes to the repository

## 🆘 Need Help?

- **Setup Issues**: Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
- **Content Questions**: Review the [Content Guidelines](./CONTENT_GUIDELINES.md)
- **Technical Problems**: Contact your development team with specific error messages

## 📚 File Structure (For Reference)

You'll mainly be working in these folders:
```
src/content/
├── knowledgeBase/     # Articles and guides (.md files)
└── products/          # Product information (.mdx files)
    ├── single-insulated/
    ├── double-insulated/
    ├── triple-insulated/
    └── litz-wire/

src/assets/images/     # Add new images here (Astro optimizes these)
├── categories/        # Category-related images
├── markets/          # Market/industry images  
└── team/             # Team photos

public/images/         # Alternative for unoptimized images
```

---

**Ready to start?** Begin with the [Setup Guide](./QUICK_START_GUIDE.md) to get your development environment running in 15 minutes. 