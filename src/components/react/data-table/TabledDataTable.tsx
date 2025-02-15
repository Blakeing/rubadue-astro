import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
} from "@/components/react/ui/tabs";
import { DataTable } from "./data-table";
import { Card, CardContent } from "@/components/react/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui/select";

interface TabData<TData> {
	label: string;
	value: string;
	data: TData[];
}

interface TabledDataTableProps<TData, TValue> {
	tabs: TabData<TData>[];
	columns: ColumnDef<TData, TValue>[];
	defaultTab?: string;
}

export function TabledDataTable<TData, TValue>({
	tabs,
	columns,
	defaultTab,
}: TabledDataTableProps<TData, TValue>) {
	const [activeTab, setActiveTab] = React.useState(defaultTab || tabs[0].value);

	return (
		<Tabs value={activeTab} className="w-full">
			<div className="md:hidden">
				<Select value={activeTab} onValueChange={setActiveTab}>
					<SelectTrigger className="w-full">
						<SelectValue>
							{tabs.find((tab) => tab.value === activeTab)?.label}
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
				<TabsContent key={tab.value} value={tab.value}>
					<DataTable columns={columns} data={tab.data} />
				</TabsContent>
			))}
		</Tabs>
	);
}
