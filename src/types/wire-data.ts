export interface WireDataBase {
	partNumber?: string;
	awg: string;
	conductor: {
		inches: string;
		mm: string;
	};
	nominalOD: {
		inches: string;
		mm: string;
	};
}

export interface WireDataWithKft extends WireDataBase {
	weightLbKft: string;
}

export interface WireDataWithFt extends WireDataBase {
	weightLbFt: string;
}

export type WireData = WireDataWithKft | WireDataWithFt;
