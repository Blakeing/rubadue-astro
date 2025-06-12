# Comprehensive Troubleshooting Guide

This guide covers both setup issues for new developers and content creation issues for writers working with the Rubadue Wire website.

## Quick Emergency Commands

```bash
# Nuclear option - start completely fresh
rm -rf node_modules
rm -rf .astro
rm pnpm-lock.yaml
pnpm install
pnpm dev

# Fix formatting issues
pnpm format

# Check for code problems
pnpm lint

# Switch to correct Node.js version (if using nvm)
nvm use
```

## Setup and Installation Issues

### Node.js Installation Problems

#### Problem: "Command not found: node" or "Command not found: npm"
**What this means**: Your computer doesn't have the required software installed or it's not in your PATH.

**Solutions**:
- **Windows**: Restart VS Code and your computer after Node.js installation
- **Mac/Linux**: Close and reopen your terminal/VS Code
- **All platforms**: Check if Node.js is in your PATH by typing `echo $PATH` (Mac/Linux) or `echo $env:PATH` (Windows PowerShell)
- **Install Node.js** from [nodejs.org](https://nodejs.org/) (choose Node.js 18 LTS version)

#### Problem: "Permission denied" when installing pnpm
**Solutions**:
- **Windows**: Right-click VS Code icon → "Run as administrator"
- **Mac**: Use `sudo npm install -g pnpm` (you'll be prompted for your password)
- **Alternative**: Use Node.js installer from nodejs.org instead of package managers

#### Problem: Wrong Node.js version installed
**Solutions**:
```bash
# Check your version
node --version

# If not 18.x, uninstall and reinstall Node.js 18
# Or use nvm to switch versions:
nvm install 18
nvm use 18
```

### Terminal/Command Line Issues

#### Problem: Can't find the terminal in VS Code
**Solution**: 
- Go to `Terminal` menu → `New Terminal`
- Or use keyboard shortcut: `Ctrl+`` ` (Windows/Linux) or `Cmd+`` ` (Mac)
- The terminal appears at the bottom of VS Code

#### Problem: Commands don't work in terminal
**Solutions**:
- Make sure you're in the right directory: `cd path/to/rubadue-astro`
- Check if you're using the right terminal (PowerShell on Windows, not Command Prompt)
- Try restarting VS Code

#### Problem: "pnpm command not found"
**Solutions**:
- Restart VS Code after installing pnpm
- Try `npm install -g pnpm` again
- Alternative: Use `npx pnpm` instead of `pnpm`

### Git/GitHub Issues

#### Problem: Can't clone repository
**Solutions**:
- Make sure you have access to the repository (ask admin to invite you)
- Try GitHub Desktop instead of command line
- Check your internet connection

#### Problem: "Permission denied (publickey)" when cloning
**Solutions**:
- Use GitHub Desktop instead of command line
- Or use HTTPS clone URL instead of SSH
- Set up SSH keys (advanced - ask for help)

### Project Setup Issues

#### Problem: `pnpm install` fails with errors
**Solutions**:
```bash
# Clear npm cache and try again
npm cache clean --force
pnpm install

# If still fails, delete node_modules and try again
rm -rf node_modules
pnpm install
```

## Development Server Issues

### Problem: Development server won't start (`pnpm dev` fails)
**Solutions**:
```bash
# Check if port 4321 is already in use
# Kill any existing processes using the port
# Windows: netstat -ano | findstr :4321
# Mac/Linux: lsof -ti:4321 | xargs kill

# Clear cache and reinstall
rm -rf node_modules
rm -rf .astro
pnpm install
pnpm dev
```

### Problem: "Port 4321 is already in use"
**What this means**: Another program is using the same port.

**Solutions**:
- Close any other instances of the development server
- **Windows**: Press `Ctrl+C` in the terminal running the server
- **Mac/Linux**: Press `Cmd+C` in the terminal running the server
- **Or use a different port**:
   ```bash
   pnpm dev --port 3000
   ```

### Problem: Changes not appearing in browser
**What this means**: Cache issues or the server needs a refresh.

**Solutions**:
1. **Hard refresh your browser**: 
   - PC: `Ctrl+F5` or `Ctrl+Shift+R`
   - Mac: `Cmd+Shift+R`
2. **Clear browser cache**
3. **Check if development server is still running**
4. **Make sure you saved the file in VS Code**
5. **Wait a few seconds** - sometimes changes take a moment to show up
6. **Restart the development server**:
   - Press `Ctrl+C` to stop the server
   - Type `pnpm dev` to start it again

## Content Creation Issues

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

#### Problem: "Error in frontmatter" or YAML frontmatter errors
**What this means**: The information at the top of your file has a formatting issue.

**Solutions**:
- Make sure you have `---` at the beginning and end
- Check that all required fields are filled in
- Make sure dates are in YYYY-MM-DD format
- Use quotes around text values
- Check indentation (use spaces, not tabs)
- Ensure quotes are properly closed
- Validate YAML syntax online if needed

### Image Issues

#### Problem: Images not showing up
**What this means**: The image path is incorrect or the image file is missing.

**Solutions**:
1. **Check image location**: Put images in the appropriate `src/assets/` directory (Astro will optimize them automatically):
   - Hero images: `src/assets/backgrounds/`
   - Product images: `src/assets/products/category/`
   - General images: `src/assets/images/`
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
5. **File extensions**: Ensure `.webp`, `.jpg`, `.png` extensions are correct
6. **Browser cache**: Hard refresh with `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)

### Build and Import Errors

#### Problem: "Module not found" errors
**Solutions**:
- Check import paths are correct
- Make sure imported files exist
- Verify file names match exactly (case-sensitive)

#### Problem: JavaScript errors in browser console
**Solutions**:
- Open browser developer tools (`F12`)
- Check the Console tab for specific errors
- Often indicates a component import issue

### Markdown Formatting Issues

#### Problem: Text formatting not working
**What this means**: Markdown syntax might be incorrect.

**Common fixes**:
- **Bold text**: `**bold text**` (two asterisks on each side)
- **Italic text**: `*italic text*` (one asterisk on each side)
- **Links**: `[Link text](https://example.com)`
- **Headings**: `## Heading` (space after the ##)

## File System and OS Issues

### Case Sensitivity
- **Mac/Linux**: File names are case-sensitive
- **Windows**: Usually not case-sensitive, but can cause issues in deployment
- **Best practice**: Always match exact case in imports and file names

### Hidden Files
#### Problem: Can't see `.nvmrc` or other dot files
**Solutions**:
- **Windows**: In File Explorer, View → Hidden items
- **Mac**: In Finder, press `Cmd+Shift+.`
- **VS Code**: These files should show up automatically

### File Permissions
#### Problem: "Permission denied" when editing files
**Solutions**:
- **Windows**: Right-click VS Code → "Run as administrator"
- **Mac/Linux**: Check file ownership with `ls -la`
- Make sure you're not editing files in system directories

### Network Issues

#### Problem: Firewall blocking development server
**Issue**: Can't access `http://localhost:4321`
**Solutions**:
- Check Windows Firewall or Mac Security settings
- Try `http://127.0.0.1:4321` instead
- Temporarily disable firewall for testing

## Git and Version Control Issues

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

## Deployment Issues

### Vercel Deployment Failures
#### Problem: Deployment fails and clicking "Details" redirects to Vercel's limits page
**Solution**: This usually indicates a configuration conflict, not a code error.

1. **Check for conflicting `vercel.json` file**:
   - If you have a `vercel.json` file in your project root, it may have outdated settings
   - **Solution**: Delete the `vercel.json` file - the Astro Vercel adapter handles all configuration automatically
   
2. **Ensure proper Node.js version**:
   - Verify your project uses Node.js 18 (see `.nvmrc` file)
   - Run `nvm use` to switch to the correct version locally
   
3. **Memory/resource limits**:
   - Large projects may exceed Vercel's build limits
   - The project is configured to use Vercel's image optimization to prevent this issue

**Prevention**: Always run `pnpm format` and `pnpm lint` before pushing to catch issues early.

## Common Error Messages Reference

| Error Message | What It Means | Quick Fix |
|---------------|---------------|-----------|
| "Command not found: node" | Node.js not installed | Install Node.js 18 LTS |
| "Command not found: pnpm" | pnpm not installed | Run `npm install -g pnpm` |
| "Port already in use" | Another server running | Close other servers or use different port |
| "Module not found" | Missing dependencies | Run `pnpm install` |
| "Frontmatter error" | Bad formatting in article header | Check YAML formatting |
| "Image not found" | Wrong image path | Check image location and path |
| "Permission denied" | Git authentication issue | Contact development team |
| "EACCES: permission denied" | Administrator rights needed | Run as administrator |

## When All Else Fails

1. **Restart everything**: Close VS Code, restart your computer
2. **Check the basics**: Are you in the right directory? Is Node.js installed?
3. **Try the emergency commands** at the top of this document
4. **Ask for help**: Screenshots of error messages are incredibly helpful
5. **Document what you tried**: This helps others help you faster

## Getting Help

### Before Asking for Help
1. **Check the error message** - often it tells you exactly what's wrong
2. **Try the quick fixes** listed above
3. **Make sure you saved your files** before testing
4. **Try the emergency commands** at the top of this guide

### What to Include When Asking for Help
- **What you were trying to do**
- **The exact error message** (copy and paste it)
- **What operating system you're using** (Windows, Mac, Linux)
- **Screenshots** of the error if possible
- **What you've already tried** to fix it
- **Steps that led to the issue**

### Quick Self-Help Commands
```bash
# Check if everything is installed correctly
node --version    # Should show v18.x.x
pnpm --version    # Should show version number

# Restart everything fresh
rm -rf node_modules
rm -rf .astro
pnpm install
pnpm dev

# Fix code formatting
pnpm format
pnpm lint
```

## Basic Terminal Commands for Beginners

> 🔰 **Never used a terminal before?** These are the essential commands you need to know.

### Opening the Terminal
- **VS Code**: `Terminal` menu → `New Terminal` (or `Ctrl+`` ` / `Cmd+`` `)
- **Windows**: Search for "PowerShell" or "Command Prompt"
- **Mac**: Search for "Terminal" in Spotlight (`Cmd+Space`)
- **Linux**: `Ctrl+Alt+T`

### Essential Navigation Commands

```bash
# See where you are (print working directory)
pwd

# List files and folders in current directory
ls                    # Mac/Linux
dir                   # Windows Command Prompt
ls                    # Windows PowerShell (also works)

# Change directory (move to a folder)
cd foldername         # Go into a folder
cd ..                 # Go up one level (back to parent folder)
cd ~                  # Go to your home directory (Mac/Linux)
cd                    # Go to your home directory (Windows)

# Examples for this project:
cd rubadue-astro      # Go into the project folder
cd src                # Go into the src folder
cd ..                 # Go back up to rubadue-astro
cd src/content        # Go directly to src/content folder
```

### File Operations
```bash
# Create a new file
touch filename.md     # Mac/Linux
echo. > filename.md   # Windows

# Create a new folder
mkdir foldername

# Copy a file
cp oldfile.md newfile.md    # Mac/Linux
copy oldfile.md newfile.md  # Windows

# Delete a file (be careful!)
rm filename.md        # Mac/Linux
del filename.md       # Windows
```

### Project-Specific Commands
```bash
# Install project dependencies
pnpm install

# Start the development server
pnpm dev

# Stop the development server
Ctrl+C               # Press Ctrl and C keys together

# Check what files you've changed
git status

# Format your code
pnpm format

# Check for code issues
pnpm lint
```

### Helpful Tips

**🔍 Tab Completion**: Start typing a folder name and press `Tab` - the terminal will complete it for you!

**📁 Drag and Drop**: On most systems, you can drag a folder from your file explorer into the terminal to get its path.

**⬆️ Command History**: Press the up arrow key to see previous commands you've run.

**🚪 Getting Unstuck**: If you get lost, type `pwd` to see where you are, then `ls` (or `dir`) to see what's in that folder.

### Common Beginner Mistakes

❌ **Typing the `$` or `>` symbols**: These are just prompts showing you can type. Don't include them in your commands.
```bash
# You see this in guides:
$ pnpm dev

# But you only type this:
pnpm dev
```

❌ **Forgetting to press Enter**: After typing a command, you must press Enter to run it.

❌ **Case sensitivity**: On Mac/Linux, `MyFolder` and `myfolder` are different. Windows is usually forgiving, but be consistent.

❌ **Spaces in folder names**: If a folder has spaces, put quotes around it:
```bash
cd "My Project Folder"
```

### Quick Reference Card
```bash
# Where am I?
pwd

# What's here?
ls        # Mac/Linux/PowerShell
dir       # Windows Command Prompt

# Go somewhere
cd foldername

# Go back
cd ..

# Go home
cd ~      # Mac/Linux
cd        # Windows

# Run project commands
pnpm install    # Set up project
pnpm dev        # Start working
Ctrl+C          # Stop server
```

---

**Remember**: Don't worry about breaking anything! The website code is safely stored in Git, so you can always go back to a previous version if something goes wrong. When in doubt, ask your development team for help. 