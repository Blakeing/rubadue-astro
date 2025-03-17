import type {
	AWGValue,
	MaterialKey,
	TemperatureUnit,
	FormValues,
	CalculationResults,
} from "./types";
import { materialPresets, awgData } from "./types";

/**
 * Convert temperature from Fahrenheit to Celsius
 * @param fahrenheit Temperature in Fahrenheit
 * @returns Temperature in Celsius
 */
export const fahrenheitToCelsius = (fahrenheit: number): number =>
	(fahrenheit - 32) * (5 / 9);

/**
 * Convert temperature from Celsius to Fahrenheit
 * @param celsius Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius: number): number =>
	celsius * (9 / 5) + 32;

/**
 * Convert length from feet to meters
 * @param feet Length in feet
 * @returns Length in meters
 */
export const feetToMeters = (feet: number): number => feet * 0.3048;

/**
 * Convert length from meters to feet
 * @param meters Length in meters
 * @returns Length in feet
 */
export const metersToFeet = (meters: number): number => meters * 3.28084;

/**
 * Calculate resistivity at a given temperature
 * @param baseResistivity Base resistivity at room temperature (20°C)
 * @param tempCoeff Temperature coefficient of resistance
 * @param temperature Current temperature
 * @param unit Temperature unit (F or C)
 * @returns Resistivity at the given temperature
 */
export const calculateResistivity = (
	baseResistivity: number,
	tempCoeff: number,
	temperature: number,
	unit: TemperatureUnit,
): number => {
	// Convert to Celsius if needed
	const temperatureC =
		unit === "F" ? fahrenheitToCelsius(temperature) : temperature;
	// Calculate resistivity at given temperature using the formula:
	// ρ(T) = ρ₀[1 + α(T - T₀)]
	// where T₀ is room temperature (20°C)
	return baseResistivity * (1 + tempCoeff * (temperatureC - 20));
};

/**
 * Calculate N1 Max and related values
 * @param data Form values
 * @param material Selected material
 * @param unit Temperature unit
 * @returns Calculation results
 */
export const calculateResults = (
	data: FormValues,
	material: MaterialKey,
	unit: TemperatureUnit,
): CalculationResults => {
	const resistivity = calculateResistivity(
		materialPresets[material].baseResistivity,
		materialPresets[material].tempCoeff,
		data.temperature,
		unit,
	);
	const conductivity = 1 / resistivity;
	const skinDepth =
		1 / Math.sqrt(Math.PI * data.frequency * data.permeability * conductivity);
	const strandDiameter = awgData[data.awg] / 1000; // Convert mm to meters
	const n1Max = Math.floor(
		(4 * (skinDepth * skinDepth)) / (strandDiameter * strandDiameter),
	);

	return {
		skinDepth,
		doubleSkinDepth: 2 * skinDepth,
		n1Max,
		resistivity,
	};
};
