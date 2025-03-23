import { SwitchableDataTable } from "@/components/react/data-table";
import { columns } from "./columns";
import { tabs } from "./data";

export function BareLitzTable() {
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
