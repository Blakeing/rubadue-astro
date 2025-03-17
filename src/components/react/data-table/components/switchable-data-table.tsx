import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/react/ui";
import type { ColumnDef } from "@tanstack/react-table";
import * as React from "react";
import type { TabData } from "../types";
import { DataTable } from "./data-table";

interface SwitchableDataTableProps<TData extends object> {
	/** Array of tab/select configurations */
	items: TabData<TData>[];
	/** Column definitions for the table */
	columns: ColumnDef<TData, unknown>[];
	/** The initially active item value */
	defaultValue?: string;
	/** Optional title for the table */
	title?: string;
	/** The variant of the switcher to use - either 'tabs' or 'select' */
	variant: "tabs" | "select";
	/** Optional placeholder for select variant */
	placeholder?: string;
}

export function SwitchableDataTable<TData extends object>({
	items,
	columns,
	defaultValue,
	title,
	variant,
	placeholder = "Please select an option",
}: SwitchableDataTableProps<TData>) {
	if (!items.length) {
		throw new Error("SwitchableDataTable requires at least one item");
	}

	const [activeValue, setActiveValue] = React.useState(
		defaultValue || items[0].value,
	);
	const activeItem =
		items.find((item) => item.value === activeValue) || items[0];

	if (variant === "select") {
		return (
			<div className="not-prose">
				{title && (
					<h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl mb-4">
						{title}
					</h3>
				)}
				<div className="space-y-2">
					<Select value={activeValue} onValueChange={setActiveValue}>
						<SelectTrigger className="w-[300px]">
							<SelectValue placeholder={placeholder}>
								{activeItem.label}
							</SelectValue>
						</SelectTrigger>
						<SelectContent>
							{items.map((item) => (
								<SelectItem key={item.value} value={item.value}>
									{item.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DataTable columns={columns} data={activeItem.data} title={title} />
			</div>
		);
	}

	return (
		<Tabs value={activeValue} className="w-full">
			<div className="md:hidden">
				<Select value={activeValue} onValueChange={setActiveValue}>
					<SelectTrigger className="w-full">
						<SelectValue>{activeItem.label}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{items.map((item) => (
							<SelectItem key={item.value} value={item.value}>
								{item.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="hidden md:block">
				<TabsList className="h-10 flex w-fit">
					{items.map((item) => (
						<TabsTrigger
							key={item.value}
							value={item.value}
							onClick={() => setActiveValue(item.value)}
						>
							{item.label}
						</TabsTrigger>
					))}
				</TabsList>
			</div>
			{items.map((item) => (
				<TabsContent
					key={item.value}
					value={item.value}
					role="tabpanel"
					aria-label={`${item.label} table`}
				>
					<DataTable columns={columns} data={item.data} title={title} />
				</TabsContent>
			))}
		</Tabs>
	);
}
