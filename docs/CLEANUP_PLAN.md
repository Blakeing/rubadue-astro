# Project Cleanup Plan

This document outlines a systematic approach to clean up the Rubadue Wire project before delivery. The cleanup focuses on removing unused files, optimizing assets, improving organization, and ensuring production readiness.

## Current Issues Identified

### 1. Unused Files and Assets
- **Blog placeholder images**: 6 unused blog-placeholder-*.jpg files in `public/`
- **Remove background images**: Several `-removebg-preview.png` files in `src/assets/`
- **Legacy test files**: `test.png`, `test-1.webp` in `public/images/`
- **Duplicate assets**: Static files appearing in multiple locations

### 2. System Files
- **6 .DS_Store files** scattered throughout the project
- Should be removed and prevented via `.gitignore`

### 3. Code Quality Issues
- **Console statements**: Multiple `console.log()` statements in production code
- **Commented code**: Extensive commented console.log statements
- **TODO comments**: Found in knowledge base articles (content issues)

### 4. Asset Organization
- **Large image files**: 3.7MB LitzPayoff.jpg file needs optimization
- **Mixed file formats**: Inconsistent use of .webp vs .jpg vs .png
- **Duplicate directory structure**: Some assets appear in both `public/` and `src/assets/`

### 5. Project Structure
- **Legacy imports**: Potential unused component imports
- **Inconsistent naming**: Mix of camelCase and kebab-case in file names

## Cleanup Implementation Plan

### Phase 1: File Cleanup (High Priority)

#### Step 1.1: Remove Unused Images
```bash
# Remove blog placeholder images
rm public/blog-placeholder-*.jpg
rm public/knowledge-base-placeholder-1.jpg

# Remove removebg-preview images
rm src/assets/*-removebg-preview.png

# Remove test images
rm public/images/test.png
rm public/images/test-1.webp
```

#### Step 1.2: Clean System Files
```bash
# Remove all .DS_Store files
find . -name ".DS_Store" -delete

# Update .gitignore to prevent future .DS_Store files
echo "**/.DS_Store" >> .gitignore
```

#### Step 1.3: Optimize Large Images
- Compress `public/images/LitzPayoff.jpg` (3.7MB → target: <500KB)
- Convert appropriate images to `.webp` format
- Optimize `public/images/man-computer-holding-wire.jpg` (172KB)

### Phase 2: Code Cleanup (Medium Priority)

#### Step 2.1: Remove Console Statements
**Files to clean:**
- `src/components/react/forms/pcim/PcimForm.tsx`
- `src/components/react/forms/quote-request/QuoteRequestForm.tsx`
- `src/utils/images.ts` (commented console.logs)

**Keep error logging in:**
- API routes (`src/pages/api/*.ts`) - these are server-side
- Critical error handling

#### Step 2.2: Clean Up Comments
- Remove commented console.log statements
- Remove development comments
- Keep essential documentation comments

### Phase 3: Asset Organization (Medium Priority)

#### Step 3.1: Consolidate Asset Structure
```
Current problematic structure:
├── public/static/text-logo.svg
├── src/assets/text-logo.svg
└── (duplicates)

Target structure:
├── public/
│   ├── images/ (static images, favicons)
│   ├── fonts/
│   └── certificates/
└── src/assets/
    ├── images/ (processed images)
    ├── products/
    ├── markets/
    └── icons/
```

#### Step 3.2: Image Format Standardization
- **Hero images**: Use `.webp` format
- **Product images**: Use `.webp` format
- **Icons**: Use `.svg` when possible
- **Certificates/PDFs**: Keep as-is

### Phase 4: Production Readiness (High Priority)

#### Step 4.1: Environment Variables
- Ensure all sensitive data uses environment variables
- Document required environment variables
- Create `.env.example` file

#### Step 4.2: Performance Optimization
- Remove unused imports
- Optimize bundle size
- Verify all images are optimized

#### Step 4.3: Final Quality Check
- Run build process and fix any errors
- Test all functionality in production build
- Verify deployment readiness

## Implementation Timeline

### Day 1: Critical Cleanup
- [ ] Remove unused image files
- [ ] Clean .DS_Store files
- [ ] Remove console.log statements from forms
- [ ] Optimize large images

### Day 2: Organization
- [ ] Consolidate asset structure
- [ ] Standardize image formats
- [ ] Clean up code comments
- [ ] Update .gitignore

### Day 3: Production Readiness
- [ ] Final build testing
- [ ] Performance verification
- [ ] Documentation updates
- [ ] Deployment verification

## Detailed Action Items

### High Priority Actions

1. **Remove Unused Files**
   ```bash
   # Blog placeholders (6 files)
   rm public/blog-placeholder-*.jpg
   rm public/knowledge-base-placeholder-1.jpg
   
   # Background removed images (4 files)
   rm src/assets/single_insulated-removebg-preview.png
   rm src/assets/double_insulated-removebg-preview.png
   rm src/assets/triple_insulated-removebg-preview.png
   rm src/assets/litz-wire-removebg-preview.png
   
   # Test files
   rm public/images/test.png
   rm public/images/test-1.webp
   ```

2. **System Cleanup**
   ```bash
   find . -name ".DS_Store" -delete
   echo -e "\n# macOS\n**/.DS_Store" >> .gitignore
   ```

3. **Image Optimization**
   - Compress LitzPayoff.jpg from 3.7MB to <500KB
   - Optimize man-computer-holding-wire.jpg

### Medium Priority Actions

4. **Code Cleanup**
   - Remove console.log from QuoteRequestForm.tsx
   - Remove console.log from PcimForm.tsx
   - Clean commented code in images.ts

5. **Asset Organization**
   - Remove duplicate text-logo.svg from public/static/
   - Standardize image formats to .webp where appropriate

### Low Priority Actions

6. **Structure Improvements**
   - Review component imports for unused dependencies
   - Standardize file naming conventions

## Verification Checklist

After cleanup, verify:

- [ ] **Build Success**: `pnpm build` completes without errors
- [ ] **No Console Output**: Browser console shows no log statements
- [ ] **Image Loading**: All images load correctly
- [ ] **Performance**: Lighthouse scores maintain quality
- [ ] **Functionality**: All features work as expected
- [ ] **Mobile Responsive**: Mobile experience unaffected
- [ ] **Git Clean**: No untracked files or .DS_Store files
- [ ] **Bundle Size**: JavaScript bundle size reasonable

## Risk Assessment

### Low Risk
- Removing unused image files
- Cleaning .DS_Store files
- Removing console.log statements

### Medium Risk
- Image optimization (verify quality)
- Asset reorganization (verify paths)

### High Risk
- None identified - all changes are safe

## Rollback Plan

If issues arise:
1. Use Git to revert specific commits
2. Keep backup of original large images
3. Test thoroughly before final commit

## Success Metrics

- **File count reduction**: ~15+ fewer unused files
- **Asset size reduction**: ~4MB+ smaller total size
- **Console output**: Zero non-error console statements
- **Build performance**: No degradation in build times
- **Lighthouse scores**: Maintain or improve current scores

---

This cleanup plan ensures a professional, maintainable codebase ready for client delivery. 