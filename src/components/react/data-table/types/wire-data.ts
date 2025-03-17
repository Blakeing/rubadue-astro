/**
 * Represents a measurement in both inches and millimeters
 */
export interface Measurement {
	inches: string | number;
	mm: string | number;
}

/**
 * Base interface for wire data shared across all tables
 */
export interface WireDataBase {
	/** Part number identifier */
	partNumber: string;
	/** American Wire Gauge (AWG) size */
	awg: string | number;
	/** Conductor measurements */
	conductor: Measurement;
	/** Nominal outer diameter measurements */
	nominalOD: Measurement;
}

/**
 * Wire data with weight in pounds per thousand feet
 */
export interface WireDataWithKft extends WireDataBase {
	/** Weight in pounds per thousand feet */
	weightLbKft: string | number;
}

/**
 * Wire data with weight in pounds per foot
 */
export interface WireDataWithFt extends WireDataBase {
	/** Weight in pounds per foot */
	weightLbFt: string | number;
}

/**
 * Union type for all wire data variants
 */
export type WireData = WireDataWithKft | WireDataWithFt;

/**
 * Type guard to check if wire data uses Kft weight
 */
export function isWireDataWithKft(data: WireData): data is WireDataWithKft {
	return "weightLbKft" in data;
}

/**
 * Type guard to check if wire data uses Ft weight
 */
export function isWireDataWithFt(data: WireData): data is WireDataWithFt {
	return "weightLbFt" in data;
}
