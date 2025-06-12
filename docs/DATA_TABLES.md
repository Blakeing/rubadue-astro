# Data Tables Guide

This guide covers everything you need to know about creating, managing, and using data tables in the Rubadue Wire website.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Table Types](#table-types)
3. [Directory Structure](#directory-structure)
4. [Creating New Data Tables](#creating-new-data-tables)
5. [Data Structure](#data-structure)
6. [Using Tables in Content](#using-tables-in-content)
7. [Customization Options](#customization-options)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)

## Overview

The website uses interactive data tables to display product specifications. These tables are:
- **Searchable** - Users can filter results
- **Sortable** - Click column headers to sort data
- **Paginated** - Large datasets are split into pages
- **Responsive** - Work on mobile and desktop
- **Accessible** - Screen reader friendly

### Built With
- **React Table (TanStack)** - Core table functionality
- **TypeScript** - Type safety for data structures
- **Tailwind CSS** - Styling and responsive design

## Table Types

The project includes several specialized table components:

### 1. **DataTable** (Basic)
```tsx
<DataTable
  data={wireData}
  columns={columns}
  title="Wire Specifications"
  pageSize={10}
/>
```
**Use for:** Simple product tables with standard features.

### 2. **WireTable** (Specialized)
```tsx
<WireTable
  data={wireData}
  columns={wireColumns}
  title="Wire Specifications"
  simple
/>
```
**Use for:** Wire-specific data with optimized defaults.

### 3. **SwitchableDataTable** (Tabbed)
```tsx
<SwitchableDataTable
  items={tabData}
  columns={columns}
  variant="tabs"
  title="Multi-Layer Specifications"
/>
```
**Use for:** Multiple related datasets (e.g., different layer thicknesses).

### 4. **WireDataTable** (Auto-configured)
```tsx
<WireDataTable
  data={wireData}
  displayName="FEP Wire Data"
  pageSize={15}
/>
```
**Use for:** Quick wire tables with automatic column generation.

## Directory Structure

Data tables are organized by product category:

```
src/components/data-display/product-tables/
├── components/           # Core table components
│   ├── data-table.tsx   # Basic table component
│   ├── wire-table.tsx   # Wire-specific table
│   ├── switchable-data-table.tsx  # Tabbed tables
│   └── base-table.tsx   # Foundation component
├── types/               # TypeScript definitions
├── utils/               # Helper functions
├── hooks/               # Custom React hooks
├── ui/                  # UI components
├── single-insulated/    # Single insulated wire tables
│   ├── fep/
│   │   ├── 002-layer/
│   │   │   └── data.ts  # Product data
│   │   └── 003-layer/
│   ├── pfa/
│   └── etfe/
├── double-insulated/    # Double insulated wire tables
├── triple-insulated/    # Triple insulated wire tables
├── insulated-litz/      # Litz wire tables
└── bare-litz/           # Bare litz wire tables
```

## Creating New Data Tables

### Step 1: Create the Data File

Create a new data file in the appropriate category directory:

```typescript
// src/components/data-display/product-tables/single-insulated/new-material/data.ts
import type { WireData } from "@/components/data-display/product-tables/types";

export const wireData: WireData[] = [
  {
    partNumber: "S24A01NX-2",
    awg: "24",
    conductor: {
      inches: "0.0201",
      mm: "0.511",
    },
    nominalOD: {
      inches: "0.0241",
      mm: "0.612",
    },
    weightLbKft: "1.35",
  },
  // ... more data entries
];
```

### Step 2: Create the Table Component

```typescript
// src/components/data-display/product-tables/single-insulated/new-material/table.tsx
import { WireDataTable } from "@/components/data-display/product-tables/components/wire-data-table";
import { wireData } from "./data";

export function NewMaterialTable() {
  return (
    <WireDataTable
      data={wireData}
      displayName="New Material Wire Data"
      pageSize={10}
      enableMultiSort={true}
      hideSearch={false}
      hidePagination={false}
    />
  );
}
```

### Step 3: Export the Component

Add your new table to the main index file:

```typescript
// src/components/data-display/product-tables/index.ts
export { NewMaterialTable } from "./single-insulated/new-material/table";
```

### Step 4: Use in Product Pages

Import and use in your product `.mdx` files:

```markdown
---
title: "New Material Wire"
description: "High-performance wire with new material insulation"
# ... other frontmatter
---

import { NewMaterialTable } from "@/components/data-display/product-tables";

<NewMaterialTable client:load />
```

## Data Structure

### WireData Interface

The standard wire data structure includes:

```typescript
interface WireData {
  partNumber: string;           // Product part number
  awg: string | number;         // Wire gauge (e.g., "24" or "24 (19/36)")
  conductor: {                  // Conductor dimensions
    inches: string;
    mm: string;
  };
  nominalOD: {                  // Nominal outer diameter
    inches: string;
    mm: string;
  };
  weightLbKft: string;          // Weight in pounds per 1000 feet
}
```

### Required Fields

- **partNumber**: Unique product identifier
- **awg**: Wire gauge specification
- **conductor**: Conductor diameter in inches and mm
- **nominalOD**: Overall diameter in inches and mm
- **weightLbKft**: Weight specification

### Optional Fields

You can extend the interface for specialized products:

```typescript
interface ExtendedWireData extends WireData {
  temperatureRating?: string;
  voltageRating?: string;
  insulationThickness?: {
    inches: string;
    mm: string;
  };
}
```

## Using Tables in Content

### Basic Usage

```markdown
import { YourTableComponent } from "@/components/data-display/product-tables";

<YourTableComponent client:load />
```

### With Custom Props

```markdown
import { DataTable } from "@/components/data-display/product-tables";
import { wireData } from "@/components/data-display/product-tables/your-category/data";
import { createWireColumns } from "@/components/data-display/product-tables/utils/create-wire-columns";

<DataTable
  data={wireData}
  columns={createWireColumns()}
  title="Custom Wire Specifications"
  pageSize={15}
  simple
  client:load
/>
```

### Important Notes

- **Always include `client:load`** - Tables are interactive React components
- **Import paths** - Use the full path from `@/components/data-display/product-tables`
- **File extension** - Product pages must use `.mdx` (not `.md`) to support React components

## Customization Options

### Table Props

All table components support these common props:

```typescript
interface TableProps {
  title?: string;              // Table title
  pageSize?: number;           // Rows per page (default: 10)
  simple?: boolean;            // Simplified styling
  enableMultiSort?: boolean;   // Allow sorting multiple columns
  hideSearch?: boolean;        // Hide search input
  hidePagination?: boolean;    // Hide pagination controls
  showPageCount?: boolean;     // Show "Page X of Y"
  showPageNumbers?: boolean;   // Show numbered pagination
  maxPageNumbers?: number;     // Max page numbers to show
  emptyMessage?: string;       // Message when no data
  className?: string;          // Additional CSS classes
}
```

### Styling Options

```tsx
// Simple, clean styling
<WireTable simple />

// Custom page size
<WireTable pageSize={25} />

// Hide search for small datasets
<WireTable hideSearch />

// Custom empty message
<WireTable emptyMessage="No wire specifications available." />
```

### Advanced Customization

For complex requirements, you can create custom column definitions:

```typescript
import { createWireColumns } from "@/components/data-display/product-tables/utils/create-wire-columns";

const customColumns = createWireColumns<YourDataType>();
// Modify columns as needed

<DataTable
  data={yourData}
  columns={customColumns}
  // ... other props
/>
```

## Best Practices

### Data Organization

1. **Consistent Structure**: Use the standard `WireData` interface when possible
2. **Accurate Data**: Verify all measurements and part numbers
3. **Complete Records**: Include all required fields for every entry
4. **Logical Grouping**: Organize related products in the same table

### Performance

1. **Reasonable Page Sizes**: Use 10-25 rows per page for best performance
2. **Data Validation**: Ensure data types match the interface
3. **Lazy Loading**: Use `client:load` to defer table rendering

### User Experience

1. **Descriptive Titles**: Use clear, specific table titles
2. **Helpful Empty States**: Provide meaningful messages when no data is found
3. **Consistent Formatting**: Follow established patterns for similar products
4. **Mobile Friendly**: Test tables on mobile devices

### Code Quality

1. **TypeScript**: Always use proper type definitions
2. **Exports**: Export new components from the main index file
3. **Naming**: Use descriptive component and file names
4. **Documentation**: Comment complex data transformations

## Troubleshooting

### Common Issues

#### Table Not Rendering
**Problem**: Table appears blank or shows an error.

**Solutions**:
- Check that you included `client:load` directive
- Verify the import path is correct
- Ensure the data file exports the correct variable name
- Check browser console for JavaScript errors

#### Data Not Displaying
**Problem**: Table renders but shows "No results found."

**Solutions**:
- Verify data array is not empty
- Check that data structure matches the expected interface
- Ensure column definitions match your data fields
- Validate that data is properly exported from the data file

#### Sorting Not Working
**Problem**: Clicking column headers doesn't sort the data.

**Solutions**:
- Check that `enableMultiSort` is not disabled when needed
- Verify column definitions include proper `sortingFn`
- Ensure data types are consistent (all strings or all numbers)

#### Mobile Display Issues
**Problem**: Table doesn't display well on mobile devices.

**Solutions**:
- Use the `simple` prop for cleaner mobile styling
- Consider reducing the number of columns for mobile
- Test with the `SwitchableDataTable` for complex data

#### Import Errors
**Problem**: "Module not found" errors when importing table components.

**Solutions**:
- Check the import path starts with `@/components/data-display/product-tables`
- Verify the component is exported from the index file
- Ensure the file extension is correct (`.tsx` for components, `.ts` for data)
- Check that the file actually exists in the expected location

### Performance Issues

#### Slow Loading
**Problem**: Tables take a long time to load or render.

**Solutions**:
- Reduce page size for large datasets
- Consider splitting large tables into multiple smaller ones
- Use `hidePagination={false}` to enable pagination
- Optimize data structure (remove unnecessary fields)

#### Memory Issues
**Problem**: Browser becomes slow or unresponsive with large tables.

**Solutions**:
- Implement pagination with smaller page sizes
- Consider server-side filtering for very large datasets
- Use `simple` prop to reduce DOM complexity
- Split data across multiple tables or tabs

### Getting Help

If you encounter issues not covered here:

1. **Check the browser console** for error messages
2. **Verify your data structure** matches the TypeScript interfaces
3. **Test with a minimal example** to isolate the problem
4. **Review existing working tables** for reference patterns
5. **Check the [main troubleshooting guide](./TROUBLESHOOTING.md)** for general issues

For additional support, include:
- The exact error message
- Your data structure and component code
- Screenshots of the issue
- Browser and device information

---

## Quick Reference

### Essential Commands
```bash
# Create new data file
touch src/components/data-display/product-tables/category/material/data.ts

# Create new table component  
touch src/components/data-display/product-tables/category/material/table.tsx

# Test your changes
pnpm dev
```

### Basic Table Template
```tsx
import { WireDataTable } from "@/components/data-display/product-tables";
import { wireData } from "./data";

export function YourTableName() {
  return (
    <WireDataTable
      data={wireData}
      displayName="Your Product Name"
      pageSize={10}
    />
  );
}
```

### Usage in MDX
```markdown
import { YourTableName } from "@/components/data-display/product-tables";

<YourTableName client:load />
```

**Remember**: Always include `client:load` and use `.mdx` files for pages with tables! 