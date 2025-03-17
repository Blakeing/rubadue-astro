import { createInsulatedLitzColumns } from "@/../shared-columns";
import type { SingleInsulatedLitzSpec } from "@/../types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<SingleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<SingleInsulatedLitzSpec>();
