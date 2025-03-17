import type { ColumnDef } from "@tanstack/react-table";
import type { TripleInsulatedLitzSpec } from "@/../types";
import { createInsulatedLitzColumns } from "@/../shared-columns";

export const columns: ColumnDef<TripleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<TripleInsulatedLitzSpec>();
