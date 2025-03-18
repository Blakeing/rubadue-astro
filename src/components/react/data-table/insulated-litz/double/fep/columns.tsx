import { createInsulatedLitzColumns } from "@/components/react/data-table/insulated-litz/shared-columns";
import type { DoubleInsulatedLitzSpec } from "@/components/react/data-table/insulated-litz/types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<DoubleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<DoubleInsulatedLitzSpec>();
