import { columns } from "./columns";
import { wireData } from "./data";
import { SimpleDataTable } from "../../../simple-data-table";

export function SingleInsulatedPfa002Table() {
	return <SimpleDataTable columns={columns} data={wireData} />;
}
