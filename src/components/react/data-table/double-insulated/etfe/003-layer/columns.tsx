import { createWireColumns } from "@/components/react/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { WireData } from "@/components/react/data-table/types";

export const columns: ColumnDef<WireData, unknown>[] =
	createWireColumns<WireData>({
		formatNumeric: true,
		useKft: false,
	});
