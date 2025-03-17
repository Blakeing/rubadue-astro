#!/bin/bash

# Fix UI component imports
find src -type f -name "*.tsx" -o -name "*.ts" -o -name "*.astro" | while read -r file; do
  # Replace individual UI component imports with index imports
  sed -i '' 's|from "@/components/react/ui/button"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/card"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/input"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/pagination"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/separator"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/table"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/alert"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/badge"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/breadcrumb"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/checkbox"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/form"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/label"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/scroll-area"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/sheet"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/tabs"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/textarea"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/toast"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/toaster"|from "@/components/react/ui"|g' "$file"
  sed -i '' 's|from "@/components/react/ui/tooltip"|from "@/components/react/ui"|g' "$file"
done

echo "UI component imports have been updated!" 