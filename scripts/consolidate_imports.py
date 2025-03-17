#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def consolidate_imports(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Find all UI imports
    ui_imports = re.finditer(r'import\s*{([^}]+)}\s*from\s*["\']@/components/react/ui["\']', content)
    
    # Collect all imported items
    imported_items = []
    for match in ui_imports:
        items = match.group(1).strip().split(',')
        for item in items:
            item = item.strip()
            if item:
                imported_items.append(item)

    if not imported_items:
        return

    # Remove duplicates and sort
    imported_items = sorted(set(imported_items))

    # Create new import statement
    new_import = f'import {{ {", ".join(imported_items)} }} from "@/components/react/ui"'

    # Replace all UI imports with the consolidated import
    content = re.sub(
        r'import\s*{[^}]+}\s*from\s*["\']@/components/react/ui["\'](\s*;)?',
        '',
        content
    )

    # Find the first import statement
    first_import = re.search(r'^import.*$', content, re.MULTILINE)
    if first_import:
        # Insert the consolidated import after the first import
        pos = first_import.end()
        content = content[:pos] + '\n' + new_import + ';' + content[pos:]
    else:
        # If no imports found, add at the beginning of the file
        content = new_import + ';\n' + content

    # Clean up multiple blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)

    with open(file_path, 'w') as f:
        f.write(content)

def main():
    # Process all TypeScript and TSX files
    for ext in ['*.tsx', '*.ts', '*.astro']:
        for file_path in Path('src').rglob(ext):
            print(f'Processing {file_path}...')
            consolidate_imports(file_path)

if __name__ == '__main__':
    main() 