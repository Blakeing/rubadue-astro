import os
import re

def update_imports(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Update DataTable imports
    content = re.sub(
        r'import\s*{\s*DataTable\s*}\s*from\s*"@/components/react/data-table/data-table"',
        'import { DataTable } from "@/components/react/data-table"',
        content
    )

    # Update WireData type imports
    content = re.sub(
        r'import\s*type\s*{\s*WireData\s*}\s*from\s*"@/components/react/data-table/types/wire-data"',
        'import type { WireData } from "@/components/react/data-table/types"',
        content
    )

    # Update createWireColumns imports
    content = re.sub(
        r'import\s*{\s*createWireColumns\s*}\s*from\s*"@/components/react/data-table/utils/create-wire-columns"',
        'import { createWireColumns } from "@/components/react/data-table"',
        content
    )

    with open(file_path, 'w') as f:
        f.write(content)

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.mdx')):
                file_path = os.path.join(root, file)
                update_imports(file_path)
                print(f"Updated imports in {file_path}")

if __name__ == "__main__":
    base_dir = "src/components/react/data-table"
    content_dir = "src/content"
    
    # Update data-table components
    process_directory(base_dir)
    
    # Update MDX content files
    process_directory(content_dir) 