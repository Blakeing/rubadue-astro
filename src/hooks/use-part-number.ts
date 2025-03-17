import type { UsePartNumberProps } from "@/types/hooks";
import { useEffect, useState } from "react";
import type { FieldValues } from "react-hook-form";

/**
 * Hook for generating and managing part numbers based on form values
 * @param props - Hook configuration
 * @returns Generated part number
 */
export function usePartNumber<T extends FieldValues>({
	formValues,
	generatePartNumber,
	onSuccess,
	onError,
}: UsePartNumberProps<T>): string {
	const [partNumber, setPartNumber] = useState("");

	useEffect(() => {
		try {
			const newPartNumber = generatePartNumber(formValues);
			setPartNumber(newPartNumber);
			onSuccess?.(newPartNumber);
		} catch (error) {
			onError?.(
				error instanceof Error
					? error
					: new Error("Failed to generate part number"),
			);
		}
	}, [formValues, generatePartNumber, onSuccess, onError]);

	return partNumber;
}
