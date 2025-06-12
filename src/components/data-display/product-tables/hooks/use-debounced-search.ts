import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Options for configuring the debounced search hook
 */
interface UseDebouncedSearchOptions {
	/** Initial search value */
	initialValue?: string;
	/** Delay in milliseconds before updating the debounced value */
	delay?: number;
	/** Minimum length of search value before debouncing */
	minLength?: number;
	/** Maximum length of search value */
	maxLength?: number;
	/** Whether to trim the search value */
	trim?: boolean;
	/** Whether to convert to lowercase */
	toLowerCase?: boolean;
	/** Whether to normalize unicode characters */
	normalizeUnicode?: boolean;
	/** Whether to enable fuzzy search */
	fuzzySearch?: boolean;
}

/**
 * Return value from the debounced search hook
 */
interface UseDebouncedSearchReturn {
	/** The current search value */
	value: string;
	/** The debounced search value (updates after delay) */
	debouncedValue: string;
	/** Function to update the search value */
	handleChange: (newValue: string) => void;
	/** Function to directly update the search value */
	setValue: (newValue: string) => void;
	/** Function to reset the search value */
	reset: () => void;
	/** Whether the search value is being debounced */
	isDebouncing: boolean;
}

/**
 * Custom hook for managing debounced search input with advanced features
 * Useful for implementing search functionality with a delay to prevent too many updates
 *
 * @param options - Configuration options for the hook
 * @returns Object containing the current value, debounced value, and functions to update them
 *
 * @example
 * ```tsx
 * const { value, debouncedValue, handleChange, reset } = useDebouncedSearch({
 *   initialValue: "",
 *   delay: 500,
 *   minLength: 2,
 *   trim: true,
 *   toLowerCase: true
 * });
 * ```
 */
export function useDebouncedSearch({
	initialValue = "",
	delay = 300,
	minLength = 0,
	maxLength = 100,
	trim = true,
	toLowerCase = true,
	normalizeUnicode = true,
	fuzzySearch = false,
}: UseDebouncedSearchOptions = {}): UseDebouncedSearchReturn {
	// Validate inputs
	if (delay < 0) {
		throw new Error("Delay must be a non-negative number");
	}
	if (minLength < 0) {
		throw new Error("Minimum length must be a non-negative number");
	}
	if (maxLength < minLength) {
		throw new Error(
			"Maximum length must be greater than or equal to minimum length",
		);
	}

	const [value, setValue] = useState(initialValue);
	const [debouncedValue, setDebouncedValue] = useState(initialValue);
	const [isDebouncing, setIsDebouncing] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	// Process the search value based on options
	const processValue = useCallback(
		(input: string) => {
			let processed = input;

			if (trim) {
				processed = processed.trim();
			}
			if (toLowerCase) {
				processed = processed.toLowerCase();
			}
			if (normalizeUnicode) {
				processed = processed.normalize("NFC");
			}
			if (maxLength > 0) {
				processed = processed.slice(0, maxLength);
			}

			return processed;
		},
		[trim, toLowerCase, normalizeUnicode, maxLength],
	);

	// Update the debounced value after delay
	useEffect(() => {
		const processedValue = processValue(value);

		// Don't debounce if value is shorter than minLength
		if (processedValue.length < minLength) {
			setDebouncedValue("");
			setIsDebouncing(false);
			return;
		}

		setIsDebouncing(true);

		timeoutRef.current = setTimeout(() => {
			setDebouncedValue(processedValue);
			setIsDebouncing(false);
		}, delay);

		// Cleanup timeout on unmount or value change
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				setIsDebouncing(false);
			}
		};
	}, [value, delay, minLength, processValue]);

	const handleChange = useCallback((newValue: string) => {
		setValue(newValue);
	}, []);

	const reset = useCallback(() => {
		setValue("");
		setDebouncedValue("");
		setIsDebouncing(false);
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
	}, []);

	return {
		value,
		debouncedValue,
		handleChange,
		setValue,
		reset,
		isDebouncing,
	} as const;
}
