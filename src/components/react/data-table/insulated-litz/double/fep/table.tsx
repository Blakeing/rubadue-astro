import { DataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { doubleInsulatedLitzData } from "./data";

export function DoubleInsulatedLitzTable() {
	return <DataTable columns={columns} data={doubleInsulatedLitzData} />;
}
