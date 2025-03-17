import { DataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { singleInsulatedLitzData } from "./data";

export function SingleInsulatedLitzTable() {
	return <DataTable columns={columns} data={singleInsulatedLitzData} />;
}
