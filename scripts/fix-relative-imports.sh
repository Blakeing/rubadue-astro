#!/bin/bash

# Fix relative imports
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.astro" | while read -r file; do
  # Replace relative imports with alias paths
  sed -i '' 's|from "../consts"|from "@/consts"|g' "$file"
  sed -i '' 's|from "../layouts/BaseLayout.astro"|from "@/layouts/BaseLayout.astro"|g' "$file"
  sed -i '' 's|from "../components/astro/layout/|from "@/components/astro/layout/|g' "$file"
  sed -i '' 's|from "../components/react/|from "@/components/react/|g' "$file"
  sed -i '' 's|from "../lib/|from "@/lib/|g' "$file"
  sed -i '' 's|from "../types/|from "@/types/|g' "$file"
  sed -i '' 's|from "../hooks/|from "@/hooks/|g' "$file"
  sed -i '' 's|from "../assets/|from "@/assets/|g' "$file"
done

echo "Relative imports have been updated to use alias paths!" 