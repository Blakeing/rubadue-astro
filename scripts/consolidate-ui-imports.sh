#!/bin/bash

# Function to consolidate imports in a file
consolidate_imports() {
  local file="$1"
  local temp_file="${file}.tmp"
  
  # Create a temporary file
  touch "$temp_file"
  
  # Flag to track if we're collecting imports
  collecting=false
  imports=""
  
  # Read the file line by line
  while IFS= read -r line; do
    if [[ $line =~ ^import.*from[[:space:]]+\"@/components/react/ui\" ]]; then
      # If we're not collecting yet, start collecting
      if [ "$collecting" = false ]; then
        collecting=true
        # Extract the imported items
        imports=$(echo "$line" | sed -E 's/import[[:space:]]*\{([^}]*)\}[[:space:]]*from.*/\1/')
      else
        # Extract and append the imported items
        new_imports=$(echo "$line" | sed -E 's/import[[:space:]]*\{([^}]*)\}[[:space:]]*from.*/\1/')
        imports="$imports, $new_imports"
        continue
      fi
    elif [ "$collecting" = true ]; then
      # If we were collecting and hit a non-import line, write the consolidated import
      echo "import { $imports } from \"@/components/react/ui\";" >> "$temp_file"
      collecting=false
      imports=""
    fi
    
    # Write the current line if we're not skipping it
    if [ "$collecting" = false ]; then
      echo "$line" >> "$temp_file"
    fi
  done < "$file"
  
  # If we were still collecting at the end, write the final import
  if [ "$collecting" = true ]; then
    echo "import { $imports } from \"@/components/react/ui\";" >> "$temp_file"
  fi
  
  # Replace the original file with the temporary file
  mv "$temp_file" "$file"
}

# Process all TypeScript and TSX files
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.astro" | while read -r file; do
  consolidate_imports "$file"
done

echo "UI imports have been consolidated!" 