export type WireData = {
	partNumber: string;
	awg: number;
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
