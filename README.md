# Rubadue Astro

A modern web application built with Astro, React, and Tailwind CSS.

## 🚀 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── content/         # Content collections and blog posts
│   ├── hooks/          # Custom React hooks
│   ├── layouts/        # Page layouts and templates
│   ├── lib/            # Utility functions and shared logic
│   ├── pages/          # Page components and routes
│   └── styles/         # Global styles and Tailwind configurations
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── tsconfig.json      # TypeScript configuration
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :----------------------- | :----------------------------------------------- |
| `pnpm install`           | Installs dependencies                            |
| `pnpm run dev`           | Starts local dev server at `localhost:4321`      |
| `pnpm run build`         | Build your production site to `./dist/`          |
| `pnpm run preview`       | Preview your build locally, before deploying     |
| `pnpm run astro ...`     | Run CLI commands like `astro add`, `astro check` |

## 🎨 Development Guidelines

### Component Organization
- Use TypeScript for all components and utilities
- Place reusable components in `src/components/`
- Keep components small and focused on a single responsibility
- Use named exports for components

### Styling
- Use Tailwind CSS for styling
- Follow utility-first CSS principles
- Use component-specific styles when needed
- Maintain consistent spacing and layout patterns

### Content Management
- Store blog posts and content collections in `src/content/`
- Use MDX for content that requires React components
- Follow the content schema defined in `src/content.config.ts`

### Performance
- Optimize images using Astro's built-in image optimization
- Minimize client-side JavaScript
- Utilize Astro's partial hydration with `client:*` directives

### TypeScript
- Maintain strict type checking
- Use interfaces for component props
- Keep types and interfaces close to where they're used

## 🔧 Configuration

The project uses several key configuration files:

- `astro.config.mjs`: Astro build and integration settings
- `tailwind.config.mjs`: Tailwind CSS customization
- `tsconfig.json`: TypeScript compiler options
- `components.json`: Shadcn UI component configurations

## 📝 License

[MIT License](LICENSE)
