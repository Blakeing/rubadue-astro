/**
 * SVG path data for wire animations
 */

export const WirePaths = {
	/**
	 * Path for a simple curved wire
	 */
	SIMPLE_CURVE: "M0 50C50 50 50 0 100 0",

	/**
	 * Path for a wave-like wire
	 */
	WAVE: "M0 50C25 50 25 0 50 0S75 50 100 50",

	/**
	 * Path for a spiral wire
	 */
	SPIRAL: "M50 50C50 25 75 25 75 50S50 75 50 50",

	/**
	 * Path for a zigzag wire
	 */
	ZIGZAG: "M0 0L25 50L50 0L75 50L100 0",

	/**
	 * Path for a looped wire
	 */
	LOOP: "M0 50C0 0 100 0 100 50S0 100 0 50",
} as const;
