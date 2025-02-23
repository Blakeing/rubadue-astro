import { columns } from "./columns";
import { wireData } from "./data";
import { SimpleDataTable } from "../../simple-data-table";

export function SingleInsulatedTca1Table() {
	return <SimpleDataTable columns={columns} data={wireData} />;
}
