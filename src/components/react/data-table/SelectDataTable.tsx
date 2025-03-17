import * as React from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import { BaseTable } from "./utils/base-table";

import type { TabData } from "./utils/types";

interface SelectDataTableProps<TData extends object> {
	tabs: TabData<TData>[];
	columns: ColumnDef<TData, unknown>[];
	defaultTab?: string;
	placeholder?: string;
	title?: string;
}

export function SelectDataTable<TData extends object>({
	tabs,
	columns,
	defaultTab,
	placeholder = "Please select an option",
	title,
}: SelectDataTableProps<TData>) {
	if (!tabs.length) {
		throw new Error("SelectDataTable requires at least one tab");
	}

	const [selectedValue, setSelectedValue] = React.useState(
		defaultTab || tabs[0].value,
	);
	const selectedTab =
		tabs.find((tab) => tab.value === selectedValue) || tabs[0];

	return (
		<div className="not-prose">
			{title && (
				<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-4">
					{title}
				</h3>
			)}
			<div className="space-y-2">
				<Select value={selectedValue} onValueChange={setSelectedValue}>
					<SelectTrigger className="w-[300px]">
						<SelectValue placeholder={placeholder}>
							{selectedTab.label}
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
			<BaseTable
				data={selectedTab.data}
				columns={columns}
				title={title}
				pageSize={10}
				enableMultiSort={true}
			/>
		</div>
	);
}
