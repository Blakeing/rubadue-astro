import { type WireSpec, columns } from "./columns";
import { DataTable } from "../data-table";

// Generate example wire specification data
const data: WireSpec[] = [
	{
		partNumber: "TXXL350/38FXXX-2(MWXX)",
		equivAwg: "13",
		coreOd: "0.1041",
		cirMils: "5600",
		noStrands: "350",
		awgOfStrands: "38",
		nominalOd: "0.1161",
		suggestedFreq: "50-100 kHz",
	},
	{
		partNumber: "TXXL350/38FXXX-3(MWXX)",
		equivAwg: "13",
		coreOd: "0.1041",
		cirMils: "5600",
		noStrands: "350",
		awgOfStrands: "38",
		nominalOd: "0.1221",
		suggestedFreq: "50-100 kHz",
	},
	{
		partNumber: "TXXL825/44FXXX-2(MWXX)",
		equivAwg: "15",
		coreOd: "0.0817",
		cirMils: "3300",
		noStrands: "825",
		awgOfStrands: "44",
		nominalOd: "0.0937",
		suggestedFreq: "400-850 kHz",
	},
	{
		partNumber: "TXXL1000/46FXXX-2(MWXX)",
		equivAwg: "16",
		coreOd: "0.0648",
		cirMils: "2600",
		noStrands: "1000",
		awgOfStrands: "46",
		nominalOd: "0.0768",
		suggestedFreq: "800-1200 kHz",
	},
	{
		partNumber: "TXXL1900/48FXXX-2(MWXX)",
		equivAwg: "17",
		coreOd: "0.0514",
		cirMils: "2100",
		noStrands: "1900",
		awgOfStrands: "48",
		nominalOd: "0.0634",
		suggestedFreq: "1-2 MHz",
	},
	{
		partNumber: "TXXL2400/50FXXX-2(MWXX)",
		equivAwg: "18",
		coreOd: "0.0407",
		cirMils: "1650",
		noStrands: "2400",
		awgOfStrands: "50",
		nominalOd: "0.0527",
		suggestedFreq: "2-3 MHz",
	},
	{
		partNumber: "TXXL3600/52FXXX-2(MWXX)",
		equivAwg: "19",
		coreOd: "0.0323",
		cirMils: "1300",
		noStrands: "3600",
		awgOfStrands: "52",
		nominalOd: "0.0443",
		suggestedFreq: "3-5 MHz",
	},
];

export function WireSpecsTable() {
	return <DataTable columns={columns} data={data} />;
}
