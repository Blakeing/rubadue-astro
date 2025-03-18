export interface DoubleInsulatedSpec {
	partNumber: string;
	awg: string;
	conductor: {
		inches: string;
		mm: string;
	};
	nominalOD: {
		inches: string;
		mm: string;
	};
	weightLbKft: string;
} 