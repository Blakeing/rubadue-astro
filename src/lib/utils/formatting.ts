/**
 * Formatting Utilities
 * 
 * Centralized formatting functions used across the application.
 * Consolidates duplicate formatting logic from multiple files.
 */

/**
 * Safely formats a number with the specified decimal places
 * @param value The value to format
 * @param decimals The number of decimal places
 * @returns The formatted number or an empty string if invalid
 */
export function formatNumber(
  value: string | number | undefined | null,
  decimals: number,
): string {
  if (value == null) return "";
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  return Number.isNaN(num) ? "" : num.toFixed(decimals);
}

/**
 * Formats an AWG value, handling both whole numbers and strand count formats
 * @param value The AWG value to format
 * @returns The formatted AWG value
 */
export function formatAWG(value: string | number | undefined | null): string {
  if (value == null) return "";
  const str = String(value);
  
  // Handle strand count format (e.g., "7x32")
  if (str.includes("x")) {
    return str;
  }
  
  // Handle numeric AWG values
  const num = Number.parseFloat(str);
  if (Number.isNaN(num)) return "";
  
  // Format whole numbers without decimals, others with appropriate precision
  return num % 1 === 0 ? num.toString() : num.toFixed(1);
}

/**
 * Convert temperature from Fahrenheit to Celsius
 * @param fahrenheit Temperature in Fahrenheit
 * @returns Temperature in Celsius
 */
export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9);
}

/**
 * Convert temperature from Celsius to Fahrenheit
 * @param celsius Temperature in Celsius
 * @returns Temperature in Fahrenheit
 */
export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

/**
 * Convert length from feet to meters
 * @param feet Length in feet
 * @returns Length in meters
 */
export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

/**
 * Convert length from meters to feet
 * @param meters Length in meters
 * @returns Length in feet
 */
export function metersToFeet(meters: number): number {
  return meters * 3.28084;
}

/**
 * Round to specified decimal places
 * @param value Value to round
 * @param decimals Number of decimal places
 * @returns Rounded value
 */
export function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Round to 3 decimal places (commonly used for diameter calculations)
 * @param value Value to round
 * @returns Rounded value to 3 decimal places
 */
export function round3(value: number): number {
  return roundToDecimals(value, 3);
}

/**
 * Excel MROUND equivalent - rounds to nearest multiple
 * @param value Value to round
 * @param multiple Multiple to round to
 * @returns Rounded value to nearest multiple
 */
export function roundToMultiple(value: number, multiple: number): number {
  return Math.round(value / multiple) * multiple;
}

/**
 * Format country code to display name
 * @param country Country code
 * @returns Formatted country name
 */
export function formatCountry(country: string): string {
  // Convert country codes to display names
  const countryMap: Record<string, string> = {
    US: "United States",
    CA: "Canada",
    MX: "Mexico",
    // Add more mappings as needed
  };
  
  return countryMap[country] || country;
}

/**
 * Format job function code to display name
 * @param jobFunction Job function code
 * @returns Formatted job function name
 */
export function formatJobFunction(jobFunction: string): string {
  // Convert job function codes to display names
  const jobFunctionMap: Record<string, string> = {
    engineer: "Engineer",
    manager: "Manager",
    purchasing: "Purchasing",
    // Add more mappings as needed
  };
  
  return jobFunctionMap[jobFunction] || jobFunction;
}
