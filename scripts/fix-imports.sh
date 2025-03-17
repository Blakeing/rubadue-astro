#!/bin/bash

# Fix UI component imports
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.astro" | while read -r file; do
  # Replace individual UI component imports with index imports
  sed -i '' -E 's|from "@/components/react/ui/([^"]+)"|from "@/components/react/ui"|g' "$file"
  
  # Replace relative paths with alias paths
  sed -i '' -E 's|from "\.\./|from "@/|g' "$file"
  sed -i '' -E 's|from "\.\./\.\./|from "@/|g' "$file"
  sed -i '' -E 's|from "\.\./\.\./\.\./|from "@/|g' "$file"
  
  # Consolidate multiple imports from the same module
  awk '
    BEGIN { print "Processing", FILENAME }
    /^import.*from/ {
      match($0, /from ["'\'']([^"'\'']+)["'\'']/, arr)
      if (arr[1] in imports) {
        imports[arr[1]] = imports[arr[1]] "\n" $0
      } else {
        imports[arr[1]] = $0
      }
      next
    }
    { print }
    END {
      for (path in imports) {
        print imports[path]
      }
    }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done

echo "Import paths have been cleaned up!" 