import type { ColumnDef } from "@tanstack/table-core";

export type WireSpec = {
  partNumber: string;
  equivAwg: string;
  coreOd: string;
  cirMils: string;
  noStrands: string;
  awgOfStrands: string;
  nominalOd: string;
  suggestedFreq: string;
};

export const columns: ColumnDef<WireSpec>[] = [
  {
    accessorKey: "partNumber",
    header: "Part Number",
  },
  {
    accessorKey: "equivAwg",
    header: "Equiv. AWG",
  },
  {
    accessorKey: "coreOd",
    header: "Core O.D. (in)",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("coreOd"));
      return value.toFixed(4);
    },
  },
  {
    accessorKey: "cirMils",
    header: "CIR. MILS",
    cell: ({ row }) => {
      const value = parseInt(row.getValue("cirMils"));
      return value.toLocaleString();
    },
  },
  {
    accessorKey: "noStrands",
    header: "No. Strands",
    cell: ({ row }) => {
      const value = parseInt(row.getValue("noStrands"));
      return value.toLocaleString();
    },
  },
  {
    accessorKey: "awgOfStrands",
    header: "AWG of Strands",
  },
  {
    accessorKey: "nominalOd",
    header: "Nominal O.D. (in)",
    cell: ({ row }) => {
      const value = parseFloat(row.getValue("nominalOd"));
      return value.toFixed(4);
    },
  },
  {
    accessorKey: "suggestedFreq",
    header: "Suggested Frequency",
  },
];
