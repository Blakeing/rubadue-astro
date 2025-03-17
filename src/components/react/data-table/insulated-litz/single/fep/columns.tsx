import type { ColumnDef } from "@tanstack/react-table";
import type { SingleInsulatedLitzSpec } from "@/../types";
import { createInsulatedLitzColumns } from "@/../shared-columns";

export const columns: ColumnDef<SingleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<SingleInsulatedLitzSpec>();
