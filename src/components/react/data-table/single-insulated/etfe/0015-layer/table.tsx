import { columns } from "./columns";
import { wireData } from "./data";
import { SimpleDataTable } from "../../../simple-data-table";

export function SingleInsulatedEtfeWireTable() {
	return <SimpleDataTable columns={columns} data={wireData} />;
}
