import { createInsulatedLitzColumns } from "../../shared-columns";
import type { TripleInsulatedLitzSpec } from "../../types";
import type { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TripleInsulatedLitzSpec>[] =
	createInsulatedLitzColumns<TripleInsulatedLitzSpec>();
