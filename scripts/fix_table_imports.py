#!/usr/bin/env python3
import os
import re
from pathlib import Path

def fix_imports(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # Fix columns import from wire-data
    content = re.sub(
        r'import { columns } from "@/components/react/data-table/types/wire-data"',
        r'import { columns } from "./columns"',
        content
    )

    # Fix incorrect columns imports
    content = re.sub(
        r'from "@/components/react/data-table/types/wire-data";\s*import { wireData }',
        r'from "./columns";\nimport { wireData }',
        content
    )

    # Fix local WireData imports
    content = re.sub(
        r'from "\./columns";\s*export const wireData',
        r'from "@/components/react/data-table/types/wire-data";\n\nexport const wireData',
        content
    )

    # Fix the wire-data type import
    content = re.sub(
        r'from "@/types/wire-data"',
        r'from "@/components/react/data-table/types/wire-data"',
        content
    )

    # Fix the create-wire-columns import
    content = re.sub(
        r'from "@/utils/create-wire-columns"',
        r'from "@/components/react/data-table/utils/create-wire-columns"',
        content
    )

    # Fix the problematic @/../../ patterns
    content = re.sub(
        r'from "@/\.\./\.\./types/([^"]+)"',
        r'from "@/types/\1"',
        content
    )
    content = re.sub(
        r'from "@/\.\./\.\./utils/([^"]+)"',
        r'from "@/utils/\1"',
        content
    )

    # Fix any remaining relative paths
    content = re.sub(
        r'from "\.\./\.\./\.\./([^"]+)"',
        r'from "@/\1"',
        content
    )
    content = re.sub(
        r'from "\.\./\.\./([^"]+)"',
        r'from "@/\1"',
        content
    )
    content = re.sub(
        r'from "\.\./([^"]+)"',
        r'from "@/\1"',
        content
    )

    with open(file_path, 'w') as f:
        f.write(content)

def main():
    # Get the project root directory
    root_dir = Path(__file__).parent.parent
    src_dir = root_dir / 'src'

    # Process all TypeScript/TSX files in the data-table directory
    data_table_dir = src_dir / 'components' / 'react' / 'data-table'
    if data_table_dir.exists():
        for file_path in data_table_dir.rglob('*.ts*'):
            if file_path.suffix in ['.ts', '.tsx']:
                print(f"Processing {file_path}")
                fix_imports(file_path)

    print("Table imports have been fixed!")

if __name__ == "__main__":
    main() 