import { createWireColumns } from "@/components/react/data-table";
import type { WireData } from "@/components/react/data-table/types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<WireData>[] = createWireColumns<WireData>({
	formatNumeric: true,
	useKft: false,
});
