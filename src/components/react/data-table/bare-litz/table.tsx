import { SwitchableDataTable } from "../components/switchable-data-table";
import { columns } from "./columns";
import { tabs } from "./data";

export function BareLitzWireTable() {
	return (
		<SwitchableDataTable
			items={tabs}
			columns={columns}
			placeholder="Select Frequency"
			defaultValue="60hz-1khz"
			variant="select"
		/>
	);
}
