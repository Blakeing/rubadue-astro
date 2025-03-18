import { WireTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { wireData } from "./data";

export function TripleInsulatedTable() {
	return <WireTable columns={columns} data={wireData} />;
}
