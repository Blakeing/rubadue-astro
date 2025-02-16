import { columns } from "./columns";
import { SelectDataTable } from "../SelectDataTable";
import { tabs } from "./data";

export function WireSpecsTable() {
	return (
		<SelectDataTable
			tabs={tabs}
			columns={columns}
			placeholder="Select Frequency"
			defaultTab="60hz-1khz"
		/>
	);
}
