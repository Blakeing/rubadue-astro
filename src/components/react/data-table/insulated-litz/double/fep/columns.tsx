import type { ColumnDef } from "@tanstack/react-table";
import type { DoubleInsulatedLitzSpec } from "@/../types";
import { createInsulatedLitzColumns } from "@/../shared-columns";

export const columns: ColumnDef<DoubleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<DoubleInsulatedLitzSpec>();
