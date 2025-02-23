export type WireData = {
	partNumber: string;
	awg: string; // Changed to string to handle formats like "18(19/30)"
	conductor: {
		inches: number;
		mm: number;
	};
	nominalOD: {
		inches: number;
		mm: number;
	};
	weightLbFt: number;
};
