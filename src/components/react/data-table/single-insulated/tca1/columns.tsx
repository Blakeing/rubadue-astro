import type { ColumnDef } from "@tanstack/react-table";
import type { WireData } from "@/../types/wire-data";
import { createWireColumns } from "@/../utils/create-wire-columns";

export const columns: ColumnDef<WireData>[] = createWireColumns<WireData>({
	formatNumeric: true,
	useKft: true,
});
