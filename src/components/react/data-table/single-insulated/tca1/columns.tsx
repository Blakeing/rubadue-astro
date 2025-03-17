import type { WireData } from "../../types/wire-data";
import { createWireColumns } from "../../utils/create-wire-columns";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<WireData>[] = createWireColumns<WireData>({
	formatNumeric: true,
	useKft: true,
});
