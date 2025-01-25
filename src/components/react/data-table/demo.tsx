import { type Payment, columns } from "./columns";
import { DataTable } from "./data-table";

// Generate some example data
const data: Payment[] = [
  {
    id: "1",
    amount: 100.0,
    status: "pending",
    email: "user1@example.com",
    date: "2025-01-20",
  },
  {
    id: "2",
    amount: 250.5,
    status: "processing",
    email: "user2@example.com",
    date: "2025-01-19",
  },
  {
    id: "3",
    amount: 750.0,
    status: "success",
    email: "user3@example.com",
    date: "2025-01-18",
  },
  {
    id: "4",
    amount: 1200.0,
    status: "failed",
    email: "user4@example.com",
    date: "2025-01-17",
  },
  {
    id: "5",
    amount: 450.75,
    status: "success",
    email: "user5@example.com",
    date: "2025-01-16",
  },
];

export function PaymentsTable() {
  return <DataTable columns={columns} data={data} />;
}
