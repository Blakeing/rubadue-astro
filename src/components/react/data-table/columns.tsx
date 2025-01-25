import type { ColumnDef } from "@tanstack/table-core"

// This type is used to define the shape of our data.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  date: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <div className="capitalize">{status}</div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
]
