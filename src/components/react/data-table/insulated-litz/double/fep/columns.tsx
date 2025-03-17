import { createInsulatedLitzColumns } from "@/../shared-columns";
import type { DoubleInsulatedLitzSpec } from "@/../types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<DoubleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<DoubleInsulatedLitzSpec>();
