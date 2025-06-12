# Troubleshooting Guide for Content Contributors

This guide covers common issues that content creators might encounter when working with the Rubadue Wire website.

## Getting Started Issues

### "Command not found" Errors

#### Problem: `node`, `npm`, or `pnpm` not found
**What this means**: Your computer doesn't have the required software installed.

**Solution**:
1. **Install Node.js** from [nodejs.org](https://nodejs.org/) (choose the LTS version)
2. **Install pnpm** by opening Terminal/Command Prompt and typing:
   ```bash
   npm install -g pnpm
   ```
3. **Restart your terminal** after installation
4. **Verify installation**:
   ```bash
   node --version    # Should show v18.x.x or higher
   pnpm --version    # Should show version number
   ```

### Development Server Won't Start

#### Problem: "Port 4321 is already in use"
**What this means**: Another program is using the same port.

**Solution**:
1. **Close any other development servers** you might have running
2. **Or use a different port**:
   ```bash
   pnpm dev --port 3000
   ```

#### Problem: "Dependencies missing" or installation errors
**What this means**: The project files need to be set up.

**Solution**:
```bash
# Try reinstalling everything
rm -rf node_modules
pnpm install
pnpm dev
```

### Changes Not Appearing

#### Problem: I made changes but don't see them in the browser
**What this means**: Cache issues or the server needs a refresh.

**Solutions**:
1. **Hard refresh your browser**: 
   - PC: Ctrl+Shift+R
   - Mac: Cmd+Shift+R
2. **Wait a few seconds** - sometimes changes take a moment to show up
3. **Restart the development server**:
   - Press Ctrl+C to stop the server
   - Type `pnpm dev` to start it again

## Content Issues

### Articles Not Showing Up

#### Problem: My new article isn't appearing on the website
**What this means**: There's likely an issue with the file location or format.

**Check these things**:
1. **File location**: 
   - Knowledge base articles go in `src/content/knowledgeBase/`
   - Product pages go in `src/content/products/category/`

2. **File naming**:
   - Use lowercase with hyphens: `my-article-title.md`
   - No spaces or special characters
   - Correct extension: `.md` for articles, `.mdx` for products

3. **Frontmatter format** (the stuff at the top between `---`):
   ```yaml
   ---
   title: "Your Article Title"
   description: "Brief description of the article"
   pubDate: "2024-01-15"
   ---
   ```

#### Problem: "Error in frontmatter" or similar
**What this means**: The information at the top of your file has a formatting issue.

**Solution**:
- Make sure you have `---` at the beginning and end
- Check that all required fields are filled in
- Make sure dates are in YYYY-MM-DD format
- Use quotes around text values

### Image Issues

#### Problem: Images not showing up
**What this means**: The image path is incorrect or the image file is missing.

**Solutions**:
1. **Check image location**: Put images in `src/assets/images/` (Astro will optimize them automatically)
2. **Check image path in your content**:
   ```markdown
   ![Alt text](@/assets/images/your-image.webp)
   ```
   Note the `@/assets/` prefix for optimized images

3. **Alternative for simple images**: You can also use `public/images/` but these won't be optimized:
   ```markdown
   ![Alt text](/images/your-image.webp)
   ```

4. **Check file name**: Make sure the path exactly matches the filename (including capitalization)

### Markdown Formatting Issues

#### Problem: Text formatting not working
**What this means**: Markdown syntax might be incorrect.

**Common fixes**:
- **Bold text**: `**bold text**` (two asterisks on each side)
- **Italic text**: `*italic text*` (one asterisk on each side)
- **Links**: `[Link text](https://example.com)`
- **Headings**: `## Heading` (space after the ##)

## Git and Saving Issues

### Can't Save Changes

#### Problem: "Permission denied" when trying to push changes
**What this means**: Git authentication issue.

**Solutions**:
1. **Make sure you're logged into GitHub** in your browser
2. **Try the GitHub Desktop app** instead of command line
3. **Ask your development team** to help with authentication

#### Problem: "Merge conflicts" or similar Git errors
**What this means**: Someone else made changes to the same file.

**Solution**:
1. **Don't panic** - this is normal
2. **Ask your development team for help** - they can resolve conflicts safely
3. **Or use GitHub Desktop** which has visual tools for resolving conflicts

### Saving Your Work

#### How to save changes properly:
```bash
# 1. Check what you've changed
git status

# 2. Add your changes
git add .

# 3. Save with a description
git commit -m "Added new article about wire insulation"

# 4. Upload to GitHub
git push
```

## Common Error Messages

| Error Message | What It Means | Quick Fix |
|---------------|---------------|-----------|
| "Command not found" | Software not installed | Install Node.js and pnpm |
| "Port already in use" | Another server running | Close other servers or use different port |
| "Module not found" | Missing dependencies | Run `pnpm install` |
| "Frontmatter error" | Bad formatting in article header | Check YAML formatting |
| "Image not found" | Wrong image path | Check image location and path |
| "Permission denied" | Git authentication issue | Contact development team |

## Getting Help

### Before Asking for Help
1. **Check the error message** - often it tells you exactly what's wrong
2. **Try the quick fixes** listed above
3. **Make sure you saved your files** before testing

### What to Include When Asking for Help
- **What you were trying to do**
- **The exact error message** (copy and paste it)
- **What operating system you're using** (Windows, Mac, Linux)
- **Screenshots** of the error if possible

### Quick Self-Help Commands
```bash
# Check if everything is installed
node --version
pnpm --version

# Restart everything fresh
rm -rf node_modules
pnpm install
pnpm dev

# Check what files you've changed
git status
```

---

**Remember**: Don't worry about breaking anything! The website code is safely stored in Git, so you can always go back to a previous version if something goes wrong. When in doubt, ask your development team for help. 