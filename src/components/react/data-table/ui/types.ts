import type { HeaderGroup, Header } from "@tanstack/react-table";

export interface TableHeaderContentProps<TData> {
	headerGroups: HeaderGroup<TData>[];
	renderHeader?: (header: Header<TData, unknown>) => React.ReactNode;
	cellClassName?: string;
} 