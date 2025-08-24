# Layout Architecture Guide

## Overview

This document outlines the unified layout architecture designed to ensure consistency across all pages and prevent issues like missing font classes, inconsistent spacing, and duplicate code.

## Architecture

### Core Layout System

```
CoreLayout (Base)
├── HomeLayout (Landing pages)
├── ContentLayout (Standard content pages)
├── ProductLayout (Product pages)
├── ToolLayout (Interactive tools)
└── BaseLayout (Legacy - to be migrated)
```

### Layout Components

#### 1. CoreLayout
**Purpose**: Base layout that ensures consistent HTML structure and styling
**Features**:
- Standardized `<html>` and `<body>` structure
- Consistent body classes: `bg-background font-sans antialiased min-h-screen`
- Header, Footer, Analytics, and Toaster components
- Customizable additional body classes

#### 2. HomeLayout
**Purpose**: Landing pages (homepage, special campaigns)
**Features**:
- Simple main wrapper
- No breadcrumbs or page headers
- Optimized for hero sections

#### 3. ContentLayout
**Purpose**: Standard content pages (about, contact, etc.)
**Features**:
- BaseHeader with eyebrow/title
- Automatic breadcrumb generation
- Standard container with responsive padding
- Flexible layout structure

#### 4. ProductLayout
**Purpose**: Product catalog and detail pages
**Features**:
- Product-specific breadcrumbs
- BaseHeader with category/title
- Product-optimized container
- Custom breadcrumb segments support

#### 5. ToolLayout
**Purpose**: Interactive tools and calculators
**Features**:
- BaseHeader with tool branding
- No breadcrumbs (tools are standalone)
- Optimized for interactive content
- Full-width container options

## Migration Guide

### Before (Inconsistent)
```astro
<!doctype html>
<html lang="en">
  <head>
    <BaseHead title={title} description={description} />
  </head>
  <body class="bg-background font-sans antialiased"> <!-- Sometimes missing classes -->
    <Header client:idle />
    <main>
      <!-- Inconsistent container structures -->
    </main>
    <Footer />
  </body>
</html>
```

### After (Consistent)
```astro
<HomeLayout title={title} description={description}>
  <Hero />
  <ProductShowcase client:load />
</HomeLayout>
```

### Migration Steps

1. **Identify page type**:
   - Landing page → `HomeLayout`
   - Standard content → `ContentLayout`
   - Product pages → `ProductLayout`
   - Tools/calculators → `ToolLayout`

2. **Replace custom HTML structure** with appropriate layout
3. **Move content** into layout slots
4. **Remove duplicate imports** (Header, Footer, BaseHead, etc.)
5. **Test** for consistency

## Benefits

### ✅ Consistency
- All pages have identical HTML structure
- Consistent body classes prevent font/styling issues
- Standardized spacing and containers

### ✅ Maintainability
- Single source of truth for layout structure
- Easy to update global elements (header, footer)
- Reduced code duplication

### ✅ Developer Experience
- Clear layout hierarchy
- Type-safe props
- Easy to understand page structure

### ✅ Performance
- Consistent hydration patterns
- Optimized component loading
- Better caching potential

## Examples

### Home Page
```astro
<HomeLayout title="Rubadue Wire" description="...">
  <Hero />
  <ProductShowcase client:load />
</HomeLayout>
```

### Content Page
```astro
<ContentLayout 
  title="About Us" 
  description="..."
  eyebrow="Company"
  headerTitle="Our Story"
>
  <div class="prose">
    <p>Content here...</p>
  </div>
</ContentLayout>
```

### Product Page
```astro
<ProductLayout 
  title="Litz Wire" 
  description="..."
  eyebrow="Products"
  breadcrumbSegments={segments}
>
  <ProductDetailPage product={product} />
</ProductLayout>
```

### Tool Page
```astro
<ToolLayout 
  title="Litz Design Tool" 
  description="..."
  eyebrow="Resources"
  headerTitle="Design Tool"
>
  <LitzDesignTool client:load />
</ToolLayout>
```

## Migration Status

### ✅ Completed
- [x] Home page (`index.astro`) → `HomeLayout`
- [x] Product listing (`products/index.astro`) → `ProductLayout`
- [x] Product detail pages (`products/[...slug].astro`) → `ProductLayout`
- [x] Knowledge base listing (`knowledge-base/index.astro`) → `ContentLayout`
- [x] Litz Design Tool (`litz-design-tool.astro`) → `ToolLayout`

### ✅ All Custom HTML Pages Migrated
All pages with custom `<body>` tags have been successfully migrated to use the unified layout system.

### 📊 Results
- **0 build errors** - All migrations compile successfully
- **Consistent styling** - All pages now have proper `font-sans antialiased` classes
- **Reduced code duplication** - Eliminated ~50+ lines of duplicate HTML per page
- **Type safety** - All layout props are type-checked

## Next Steps

1. Complete migration of remaining pages
2. Remove old BaseLayout once all pages are migrated
3. Add layout-specific optimizations
4. Consider adding more specialized layouts if needed
