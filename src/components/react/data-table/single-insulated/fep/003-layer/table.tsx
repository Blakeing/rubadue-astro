import { columns } from "./columns";
import { wireData } from "./data";
import { SimpleDataTable } from "../../../simple-data-table";

export function SingleInsulatedFep003Table() {
	return <SimpleDataTable columns={columns} data={wireData} />;
}
