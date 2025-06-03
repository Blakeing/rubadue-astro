# Data Tables Documentation

This guide covers how to work with data tables in the Rubadue Wire website. Data tables display technical specifications for products and are a critical component of the product catalog.

## Table of Contents

1. [Overview](#overview)
2. [Table Structure](#table-structure)
3. [Creating New Data Tables](#creating-new-data-tables)
4. [Modifying Existing Tables](#modifying-existing-tables)
5. [Data Management](#data-management)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

## Overview

### What Are Data Tables?

Data tables are interactive components that display product specifications in a sortable, searchable, paginated format. They include:

- **Product specifications** (part numbers, AWG sizes, dimensions, weights)
- **Sorting capabilities** (click column headers to sort)
- **Search functionality** (filter results by any field)
- **Pagination** (for large datasets)
- **Responsive design** (works on mobile and desktop)

### Where Data Tables Are Used

Data tables appear on product pages throughout the catalog:
- Single Insulated products (`/catalog/single-insulated/`)
- Double Insulated products (`/catalog/double-insulated/`)
- Triple Insulated products (`/catalog/triple-insulated/`)
- Litz Wire products (`/catalog/litz-wire/`)

## Table Structure

### Directory Organization

Data tables are organized by product category and material:

```
src/components/react/data-table/
├── components/           # Core table components
├── types/               # TypeScript definitions
├── utils/               # Helper functions
├── ui/                  # UI components
├── hooks/               # React hooks
└── [product-category]/  # Product-specific tables
    └── [material]/      # Material-specific tables
        └── [layer]/     # Layer-specific tables
            ├── data.ts     # Product data
            ├── columns.tsx # Column definitions
            └── table.tsx   # Table component
```

### Example Structure

For a Single Insulated FEP .002"/Layer product:

```
src/components/react/data-table/single-insulated/fep/002-layer/
├── data.ts      # All product specifications
├── columns.tsx  # How columns are configured
└── table.tsx    # The React component
```

### File Purposes

#### `data.ts` - Product Specifications
Contains all the technical data for the product line:

```typescript
export const wireData: WireData[] = [
  {
    partNumber: "S22A19FX-2",
    awg: "22 (19/32)",
    conductor: {
      inches: "0.0295",
      mm: "0.749",
    },
    nominalOD: {
      inches: "0.0335", 
      mm: "0.851",
    },
    weightLbKft: "2.15",
  },
  // ... more products
];
```

#### `columns.tsx` - Column Configuration
Defines which columns appear and how they're formatted:

```typescript
import { createWireColumns } from "@/components/react/data-table";
import type { WireData } from "@/components/react/data-table/types";

export const columns = createWireColumns<WireData>();
```

#### `table.tsx` - React Component
The actual table component that gets imported into product pages:

```typescript
import { WireTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function SingleInsulatedTable() {
  return (
    <WireTable
      columns={columns}
      data={wireData}
      simple
      pageSize={10}
      enableMultiSort={true}
      hideSearch={false}
      hidePagination={false}
    />
  );
}
```

## Creating New Data Tables

### Step 1: Create Directory Structure

1. Navigate to the appropriate product category:
   ```bash
   cd src/components/react/data-table/[category]/[material]/
   ```

2. Create a new directory for your product:
   ```bash
   mkdir new-product-layer
   cd new-product-layer
   ```

### Step 2: Create Data File (`data.ts`)

Create the data file with your product specifications:

```typescript
import type { WireData } from "@/components/react/data-table/types";

export const wireData: WireData[] = [
  {
    partNumber: "YOUR-PART-NUMBER",
    awg: "AWG SIZE",
    conductor: {
      inches: "DIAMETER_IN_INCHES",
      mm: "DIAMETER_IN_MM",
    },
    nominalOD: {
      inches: "OD_IN_INCHES",
      mm: "OD_IN_MM", 
    },
    weightLbKft: "WEIGHT_LB_PER_KFT",
  },
  // Add more products as needed
];
```

#### Data Requirements

Each product entry must include:
- **partNumber**: Unique product identifier (string)
- **awg**: Wire gauge size (string or number)
- **conductor**: Conductor diameter in inches and mm
- **nominalOD**: Nominal outer diameter in inches and mm  
- **weightLbKft**: Weight in pounds per thousand feet (string or number)

#### Data Formatting Guidelines

- **Measurements**: Use strings for precise decimal values
- **Part Numbers**: Follow established naming conventions
- **AWG Sizes**: Include strand information when applicable (e.g., "22 (19/32)")
- **Decimals**: Use consistent precision (typically 4 decimal places for inches)

### Step 3: Create Columns File (`columns.tsx`)

For standard wire tables, use the default column configuration:

```typescript
import { createWireColumns } from "@/components/react/data-table";
import type { WireData } from "@/components/react/data-table/types";

export const columns = createWireColumns<WireData>();
```

### Step 4: Create Table Component (`table.tsx`)

Create the React component:

```typescript
import { WireTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function YourProductTable() {
  return (
    <WireTable
      columns={columns}
      data={wireData}
      simple
      pageSize={10}
      enableMultiSort={true}
      hideSearch={false}
      hidePagination={false}
    />
  );
}
```

#### Component Naming Convention

Use descriptive names that indicate the product:
- `SingleInsulatedTable`
- `DoubleInsulatedTable` 
- `LitzWireTable`
- `TripleInsulatedTable`

### Step 5: Connect to Product Page

In your product's `.mdx` file, import and use the table:

```markdown
---
title: "Your Product Name"
description: "Product description"
pubDate: "2024-01-15"
category: "Product Category"
---

import { YourProductTable } from "@/components/react/data-table/category/material/layer/table";

<YourProductTable client:load />
```

**Important**: Always include `client:load` directive for proper hydration.

## Modifying Existing Tables

### Adding New Products

1. Open the appropriate `data.ts` file
2. Add new product objects to the array:

```typescript
export const wireData: WireData[] = [
  // ... existing products
  {
    partNumber: "NEW-PART-NUMBER",
    awg: "NEW-AWG-SIZE",
    conductor: {
      inches: "0.0000",
      mm: "0.000",
    },
    nominalOD: {
      inches: "0.0000",
      mm: "0.000",
    },
    weightLbKft: "0.00",
  },
];
```

### Updating Product Specifications

1. Find the product in the `data.ts` file
2. Update the relevant fields:

```typescript
{
  partNumber: "S22A19FX-2",
  awg: "22 (19/32)",
  conductor: {
    inches: "0.0295", // ← Update this value
    mm: "0.749",      // ← And this value
  },
  nominalOD: {
    inches: "0.0335",
    mm: "0.851",
  },
  weightLbKft: "2.15",
},
```

### Removing Products

1. Open the `data.ts` file
2. Remove the entire product object from the array
3. Be careful not to break the array syntax (commas, brackets)

### Customizing Table Behavior

Modify the table component to change behavior:

```typescript
export function YourProductTable() {
  return (
    <WireTable
      columns={columns}
      data={wireData}
      simple
      pageSize={20}              // ← Show more rows per page
      enableMultiSort={false}    // ← Disable multi-column sorting
      hideSearch={true}          // ← Hide search functionality
      hidePagination={false}     // ← Show/hide pagination
    />
  );
}
```

## Data Management

### Data Quality Guidelines

#### Consistency
- Use consistent decimal precision across similar measurements
- Follow established part number naming conventions
- Maintain uniform units and formatting

#### Accuracy
- Verify all technical specifications with engineering
- Double-check unit conversions (inches to mm)
- Ensure part numbers match official documentation

#### Completeness
- Include all required fields for every product
- Don't leave fields empty - use "N/A" or appropriate placeholder
- Maintain complete datasets for product families

### Data Sources

When adding or updating data:

1. **Engineering Specifications**: Primary source for technical data
2. **Product Catalogs**: Cross-reference with printed materials
3. **Test Data**: Use verified test results for performance specs
4. **Standards Documentation**: Ensure compliance data is current

### Version Control for Data

When making data changes:

```bash
# Check current status
git status

# Add your changes
git add src/components/react/data-table/[category]/[material]/[layer]/data.ts

# Commit with descriptive message
git commit -m "Update S22A19FX-2 conductor diameter specifications"

# Push changes
git push
```

## Common Patterns

### Standard Wire Table Pattern

Most wire products follow this pattern:

```
1. Create directory: /[category]/[material]/[layer]/
2. Add data.ts with WireData[] array
3. Add columns.tsx with createWireColumns()
4. Add table.tsx with WireTable component
5. Import in product .mdx file
```

### Multi-Tab Tables

For products with multiple variants, use the switchable table:

```typescript
import { SwitchableDataTable } from "@/components/react/data-table";

const tabData = [
  {
    label: "Standard",
    value: "standard", 
    data: standardWireData
  },
  {
    label: "High Temp",
    value: "high-temp",
    data: highTempWireData
  }
];

export function MultiVariantTable() {
  return (
    <SwitchableDataTable
      tabs={tabData}
      columns={columns}
    />
  );
}
```

### Custom Column Configuration

For tables with special requirements:

```typescript
import { ColumnDef } from "@tanstack/react-table";
import type { WireData } from "@/components/react/data-table/types";

export const columns: ColumnDef<WireData>[] = [
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "awg", 
    header: "AWG",
  },
  // ... custom column definitions
];
```

## Troubleshooting

### Common Issues

#### Table Not Displaying

**Problem**: Table component doesn't appear on product page

**Solutions**:
1. Check import path in `.mdx` file
2. Ensure `client:load` directive is present
3. Verify component is properly exported
4. Check browser console for JavaScript errors

#### Data Not Loading

**Problem**: Table shows but no data appears

**Solutions**:
1. Verify data export in `data.ts`: `export const wireData = ...`
2. Check data import in `table.tsx`
3. Ensure data matches `WireData` interface
4. Check for TypeScript errors

#### Formatting Issues

**Problem**: Numbers or text display incorrectly

**Solutions**:
1. Check data types (strings vs numbers)
2. Verify decimal precision consistency
3. Ensure proper escaping for special characters
4. Review column configuration

#### Performance Issues

**Problem**: Table loads slowly with large datasets

**Solutions**:
1. Reduce `pageSize` for initial load
2. Consider data pagination
3. Optimize data structure
4. Remove unnecessary fields

### Debugging Steps

1. **Check Browser Console**: Look for JavaScript errors
2. **Verify File Structure**: Ensure all files exist and are named correctly
3. **Test Data Format**: Validate against TypeScript interfaces
4. **Check Imports**: Verify all import paths are correct
5. **Review Git History**: See what changed recently

### Getting Help

When reporting table issues, include:

1. **Product/table location**: Which product page and table
2. **Expected behavior**: What should happen
3. **Actual behavior**: What actually happens
4. **Error messages**: Any console errors or build failures
5. **Recent changes**: What you modified recently

## Best Practices

### Development Workflow

1. **Test Locally**: Always verify tables work in development
2. **Validate Data**: Check all measurements and specifications
3. **Review Formatting**: Ensure consistent presentation
4. **Cross-Reference**: Compare with existing similar products
5. **Document Changes**: Use clear commit messages

### Maintenance

1. **Regular Reviews**: Check data accuracy quarterly
2. **Update Standards**: Keep compliance information current
3. **Performance Monitoring**: Watch for slow-loading tables
4. **User Feedback**: Address usability issues promptly

### Content Guidelines

1. **Precision**: Use appropriate decimal places for measurements
2. **Clarity**: Make part numbers and specifications clear
3. **Completeness**: Include all relevant product variants
4. **Accuracy**: Verify all technical data with engineering

---

This documentation covers the essential aspects of working with data tables. For advanced customization or technical issues, consult with your development team. 