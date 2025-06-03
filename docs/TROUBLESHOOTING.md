# Troubleshooting Guide

This guide covers common issues and their solutions when working with the Rubadue Wire website.

## Development Environment Issues

### Node.js and pnpm Issues

#### "Command not found: node" or "Command not found: pnpm"

**Problem**: Node.js or pnpm not installed or not in PATH

**Solutions**:
1. **Reinstall Node.js**:
   - Download from [nodejs.org](https://nodejs.org/)
   - Choose LTS version
   - Follow installer instructions
   - Restart terminal after installation

2. **Install pnpm**:
   ```bash
   npm install -g pnpm
   ```

3. **Check installations**:
   ```bash
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show version number
   pnpm --version    # Should show version number
   ```

#### "Permission denied" errors on macOS/Linux

**Problem**: Permission issues with global package installation

**Solution**:
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Or use a Node version manager like nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Development Server Issues

#### "Port 4321 is already in use"

**Problem**: Another process is using the development port

**Solutions**:
1. **Kill existing process**:
   ```bash
   # Find process using port 4321
   lsof -ti:4321
   # Kill the process (replace PID with actual process ID)
   kill -9 [PID]
   ```

2. **Use different port**:
   ```bash
   pnpm dev --port 3000
   ```

#### Development server won't start

**Problem**: Dependencies or cache issues

**Solution**:
```bash
# Clear everything and reinstall
rm -rf node_modules
rm pnpm-lock.yaml
rm -rf .astro
pnpm install
pnpm dev
```

#### Changes not reflecting in browser

**Problem**: Cache or hot reload issues

**Solutions**:
1. **Hard refresh browser**: Ctrl+Shift+R (PC) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: Developer Tools > Application > Storage > Clear Site Data
3. **Restart dev server**:
   ```bash
   # Stop server (Ctrl+C) then restart
   pnpm dev
   ```

## Content Issues

### Markdown/MDX Files Not Displaying

#### Article or product not showing up

**Problem**: File location, naming, or frontmatter issues

**Solutions**:
1. **Check file location**:
   - Knowledge base: `src/content/knowledgeBase/filename.md`
   - Products: `src/content/products/category/filename.mdx`

2. **Verify filename format**:
   - Use kebab-case: `my-article-title.md`
   - No spaces or special characters
   - Correct file extension (`.md` for knowledge base, `.mdx` for products)

3. **Check frontmatter syntax**:
   ```yaml
   ---
   title: "Required Title"
   description: "Required description"
   pubDate: "2024-01-15"  # Required, YYYY-MM-DD format
   category: "Single Insulated"  # Required for products
   ---
   ```

#### "Cannot read properties of undefined" errors

**Problem**: Missing required frontmatter fields

**Solution**: Ensure all required fields are present:

**Knowledge Base Articles**:
```yaml
---
title: "Article Title"      # Required
description: "Description"   # Required
pubDate: "2024-01-15"       # Required
tags: ["Tag1", "Tag2"]      # Optional but recommended
---
```

**Products**:
```yaml
---
title: "Product Name"       # Required
description: "Description"   # Required
pubDate: "2024-01-15"       # Required
category: "Category Name"    # Required
---
```

### Image Issues

#### Images not loading or showing broken links

**Problem**: Incorrect image paths or missing files

**Solutions**:
1. **Check image paths**:
   - Public images: `/images/filename.webp` (note leading slash)
   - Asset images: `@/assets/path/filename.webp` (note @ symbol)

2. **Verify image exists**:
   - Public images: Check `public/images/` directory
   - Asset images: Check `src/assets/` directory

3. **Check file extensions**:
   - Ensure path exactly matches filename including extension
   - Case-sensitive on some systems

4. **Image optimization**:
   ```bash
   # If images are too large, optimize them
   # Use online tools or image editing software to compress
   ```

#### Hero images not displaying

**Problem**: Incorrect heroImage path in frontmatter

**Solution**:
```yaml
# For public images
heroImage: "/images/hero-image.webp"

# For asset images
heroImage: "@/assets/images/hero-image.webp"
```

## Build and Deployment Issues

### Build Failures

#### "Build failed" with unclear errors

**Problem**: Various build-time issues

**Solutions**:
1. **Check build output**:
   ```bash
   pnpm build
   # Read error messages carefully
   ```

2. **Common fixes**:
   ```bash
   # Clear cache and rebuild
   rm -rf .astro
   rm -rf dist
   pnpm build
   ```

3. **Check for TypeScript errors**:
   ```bash
   # Run type checking
   npx tsc --noEmit
   ```

#### Import/component errors

**Problem**: Missing or incorrect component imports

**Solutions**:
1. **Check import paths**:
   ```javascript
   // Correct
   import { ComponentName } from "@/components/path/to/component";
   
   // Incorrect - missing @ symbol
   import { ComponentName } from "/components/path/to/component";
   ```

2. **Verify component exists**:
   - Check file exists at specified path
   - Ensure component is properly exported

### Deployment Issues

#### Vercel deployment failures

**Problem**: Build failing in production but working locally

**Solutions**:
1. **Check environment variables**: Ensure all required env vars are set in Vercel
2. **Node version mismatch**:
   ```json
   // Add to package.json
   "engines": {
     "node": ">=18.0.0"
   }
   ```

3. **Check build logs**: Review Vercel deployment logs for specific errors

## Content Management Issues

### Git and Version Control

#### "Failed to push" or merge conflicts

**Problem**: Git synchronization issues

**Solutions**:
1. **Pull latest changes first**:
   ```bash
   git pull origin main
   ```

2. **Resolve conflicts**:
   ```bash
   # If conflicts exist, edit files to resolve
   git add .
   git commit -m "Resolve merge conflicts"
   git push
   ```

3. **Reset if needed** (use carefully):
   ```bash
   # Reset to remote state (loses local changes)
   git fetch origin
   git reset --hard origin/main
   ```

#### "Permission denied" for Git operations

**Problem**: Git authentication issues

**Solutions**:
1. **Check Git credentials**: Ensure you're authenticated with GitHub
2. **Use HTTPS instead of SSH**: Clone with HTTPS URL if SSH issues
3. **Update credentials**: Re-authenticate with GitHub

### Performance Issues

#### Site loading slowly in development

**Problem**: Large images or too many files

**Solutions**:
1. **Optimize images**: Compress images before adding
2. **Use `.webp` format**: Better compression than PNG/JPG
3. **Limit concurrent files**: Don't edit too many files simultaneously

#### Build taking too long

**Problem**: Processing many images or files

**Solutions**:
1. **Optimize images before adding them**
2. **Remove unused files** from `public/` and `src/assets/`
3. **Clear cache periodically**:
   ```bash
   rm -rf .astro
   rm -rf node_modules/.cache
   ```

## Getting Additional Help

### Self-Diagnosis Steps

Before asking for help:

1. **Check terminal output**: Look for specific error messages
2. **Try in incognito/private browsing**: Rules out browser cache issues
3. **Test on different browser**: Ensures it's not browser-specific
4. **Check recent changes**: What did you change that might have caused the issue?

### Information to Provide When Asking for Help

Include the following information:

1. **Operating System**: Windows, macOS, or Linux
2. **Node.js version**: `node --version`
3. **Error message**: Copy the exact error from terminal
4. **Steps to reproduce**: What you were doing when the error occurred
5. **Recent changes**: What files you've modified recently
6. **Browser console errors**: Open Developer Tools > Console

### Common Error Messages and Solutions

| Error Message | Most Likely Cause | Quick Fix |
|---------------|-------------------|-----------|
| "Cannot find module" | Missing dependency or wrong import path | Check import paths, run `pnpm install` |
| "Port already in use" | Another dev server running | Kill process or use different port |
| "Permission denied" | File/folder permissions | Check file permissions, run as admin if needed |
| "Syntax error in frontmatter" | YAML formatting error | Check indentation and quotes in frontmatter |
| "Image not found" | Wrong image path | Verify image exists and path is correct |
| "Build failed" | Various build issues | Clear cache, check for TypeScript errors |

---

**Still having issues?** Contact your development team with the specific error message and steps you've tried. Screenshots of error messages can be very helpful for diagnosis. 