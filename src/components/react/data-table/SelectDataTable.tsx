import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui/select";
import { Label } from "@/components/react/ui/label";
import { Separator } from "../ui";

interface TabData<TData> {
	label: string;
	value: string;
	data: TData[];
}

interface SelectDataTableProps<TData, TValue> {
	tabs: TabData<TData>[];
	columns: ColumnDef<TData, TValue>[];
	defaultTab?: string;
	placeholder?: string;
}

export function SelectDataTable<TData, TValue>({
	tabs,
	columns,
	defaultTab,
	placeholder = "Please select an option",
}: SelectDataTableProps<TData, TValue>) {
	// Initialize with defaultTab to show checkmark on load
	const [selectedValue, setSelectedValue] = React.useState<string>(
		defaultTab || tabs[0].value,
	);
	const [activeData, setActiveData] = React.useState<TData[]>(() => {
		const initialTab = tabs.find((tab) => tab.value === defaultTab) || tabs[0];
		return initialTab.data;
	});

	const handleValueChange = (value: string) => {
		setSelectedValue(value);
		const selectedTab = tabs.find((tab) => tab.value === value);
		if (selectedTab) {
			setActiveData(selectedTab.data);
		}
	};

	return (
		<div className="not-prose">
			<h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl mb-6 ">
				Recommended Operating Frequency
			</h2>
			<Separator className="my-6" />
			<div className="space-y-2">
				<Select value={selectedValue} onValueChange={handleValueChange}>
					<SelectTrigger className="w-[300px] ">
						<SelectValue placeholder={placeholder}>
							{selectedValue
								? tabs.find((tab) => tab.value === selectedValue)?.label
								: null}
						</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{tabs.map((tab) => (
							<SelectItem key={tab.value} value={tab.value}>
								{tab.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<DataTable columns={columns} data={activeData} />
		</div>
	);
}
