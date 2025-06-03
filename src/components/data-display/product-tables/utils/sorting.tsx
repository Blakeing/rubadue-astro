import { Button } from "@/components/ui";
import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

// Helper function to get sort icon
export function getSortIcon(isSorted: boolean | string) {
	if (isSorted === "asc") {
		return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
	}
	if (isSorted === "desc") {
		return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
	}
	return <ArrowUpDown className="ml-2 h-4 w-4 text-muted-foreground" />;
}

// Helper function to get next sort state
export function getNextSortState(
	currentState: boolean | string,
): "asc" | "desc" | false {
	if (currentState === false) return "asc";
	if (currentState === "asc") return "desc";
	return false;
}

// Helper function to handle sort click
export function handleSortClick<TData>(column: Column<TData, unknown>) {
	const isSorted = column.getIsSorted();
	const nextState = getNextSortState(isSorted);
	if (nextState === false) {
		column.clearSorting();
	} else {
		column.toggleSorting(nextState === "desc");
	}
}

// Helper function to create a sortable column header
export function createSortableHeader<TData>(
	label: string,
	column: Column<TData, unknown>,
) {
	return (
		<Button
			variant="ghost"
			onClick={() => handleSortClick(column)}
			className="hover:bg-muted/50"
		>
			{label}
			{getSortIcon(column.getIsSorted())}
		</Button>
	);
}
