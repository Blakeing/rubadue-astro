# Components Directory Structure

```
src/
├── components/
│   ├── astro/              # Pure Astro components
│   │   ├── layout/         # Layout-specific components
│   │   │   ├── Header.astro
│   │   │   ├── Footer.astro
│   │   │   └── BaseHead.astro
│   │   └── common/         # Reusable Astro components
│   │       ├── FormattedDate.astro
│   │       └── HeaderLink.astro
│   ├── react/             # React components
│   │   ├── search/        # Search-related components
│   │   │   └── BlogSearch.tsx
│   │   └── ui/           # UI components
│   │       └── Button.tsx
│   └── shared/           # Components that might use both Astro and React
│       └── ThemeToggle/
├── layouts/              # Page layouts
│   └── Layout.astro
├── pages/               # Routes and pages (Astro)
│   └── *.astro
└── styles/              # Global styles
    └── global.css
```

## File Organization Guidelines

1. **Astro Components** (`components/astro/`):
   - Pure Astro components with minimal client-side JavaScript
   - Layout components that define the page structure
   - Common UI elements that don't need interactivity

2. **React Components** (`components/react/`):
   - Interactive components that need client-side JavaScript
   - Components that manage state or use hooks
   - Complex UI elements with rich interactions

3. **Shared Components** (`components/shared/`):
   - Components that might use both Astro and React
   - Components that can be rendered differently based on context
   - Wrapper components that might use client directives

## Naming Conventions

- Astro components: `PascalCase.astro`
- React components: `PascalCase.tsx`
- Utility files: `camelCase.ts`
- Style modules: `PascalCase.module.css`

## Best Practices

1. **Client Directives**:
   - Use `client:load` for components that need immediate interactivity
   - Use `client:visible` for components that can wait until visible
   - Use `client:idle` for low-priority interactive components

2. **Type Safety**:
   - Use TypeScript for all components
   - Define prop interfaces for components
   - Export types from a separate `types.ts` file

3. **Component Organization**:
   - Keep related files together (component, types, styles)
   - Use index files for cleaner imports
   - Split large components into smaller, focused ones
