import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "./data-table";

interface TabData<TData> {
	/** The display label for the tab */
	label: string;
	/** The unique identifier for the tab */
	value: string;
	/** The data to display in the table */
	data: TData[];
}

interface TabledDataTableProps<TData> {
	/** Array of tab configurations */
	tabs: TabData<TData>[];
	/** Column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** The initially active tab value */
	defaultTab?: string;
	/** Optional title for the table */
	title?: string;
}

export function TabledDataTable<TData>({
	tabs,
	columns,
	defaultTab,
	title,
}: TabledDataTableProps<TData>) {
	// Validate tabs array is not empty
	if (!tabs.length) {
		throw new Error("TabledDataTable requires at least one tab");
	}

	const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].value);

	// Find the active tab data
	const activeTabData = tabs.find((tab) => tab.value === activeTab);

	return (
		<Tabs value={activeTab} className="w-full">
			<div className="md:hidden">
				<Select
					value={activeTab}
					onValueChange={setActiveTab}
					aria-label="Select table view"
				>
					<SelectTrigger className="w-full">
						<SelectValue>{activeTabData?.label}</SelectValue>
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
			<div className="hidden md:block">
				<TabsList className="h-10 flex w-fit">
					{tabs.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							onClick={() => setActiveTab(tab.value)}
						>
							{tab.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			{tabs.map((tab) => (
				<TabsContent
					key={tab.value}
					value={tab.value}
					role="tabpanel"
					aria-label={`${tab.label} table`}
				>
					<DataTable columns={columns} data={tab.data} title={title} />
				</TabsContent>
			))}
		</Tabs>
	);
}
