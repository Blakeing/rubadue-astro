export interface WireData {
	partNumber: string;
	awg: string | number;
	conductor: {
		inches: string | number;
		mm: string | number;
	};
	nominalOD: {
		inches: string | number;
		mm: string | number;
	};
	weightLbKft: string | number;
}
