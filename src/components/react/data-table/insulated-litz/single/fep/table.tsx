import { columns } from "./columns";
import { singleInsulatedLitzData } from "./data";
import { DataTable } from "@/components/react/data-table/data-table";

export function SingleInsulatedLitzTable() {
	return <DataTable columns={columns} data={singleInsulatedLitzData} />;
}
