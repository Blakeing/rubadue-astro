/**
 * Base interface for insulated litz wire specifications
 */
export interface InsulatedLitzSpec {
	/** Part number of the wire */
	partNumber: string;
	/** Equivalent AWG size */
	equivalentAWG?: number;
	/** Core diameter in inches */
	coreDiameter?: number;
	/** Circular mils */
	circularMils?: number;
	/** Number of strands */
	numberOfStrands?: number;
	/** AWG size of individual strands */
	awgOfStrands?: number;
	/** Nominal outer diameter in inches */
	nominalOD?: number;
	/** Suggested operating frequency */
	suggestedOperatingFreq?: string;
}

/**
 * Interface for triple insulated litz wire specifications
 */
export interface TripleInsulatedLitzSpec extends InsulatedLitzSpec {
	/** Additional properties specific to triple insulated litz wire can be added here */
} 