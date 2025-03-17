import { createWireColumns } from "@/components/react/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { WireData } from "./types";

export const columns: ColumnDef<WireData>[] = createWireColumns<WireData>({
	formatNumeric: true,
	useKft: true,
});
