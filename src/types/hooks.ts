import type { ToastProps } from "@radix-ui/react-toast";
import type { FieldValues } from "react-hook-form";

import type { ReactNode } from "react";

/**
 * Props for usePartNumber hook
 */
export interface UsePartNumberProps<T extends FieldValues> {
	/** Form values to generate part number from */
	formValues: T;
	/** Function to generate part number from form values */
	generatePartNumber: (values: T) => string;
	/** Callback when part number is successfully generated */
	onSuccess?: (partNumber: string) => void;
	/** Callback when part number generation fails */
	onError?: (error: unknown) => void;
}

/**
 * Toast configuration
 */
export interface ToasterToast extends Omit<ToastProps, "title"> {
	/** Unique identifier for the toast */
	id: string;
	/** Toast title */
	title?: string | ReactNode;
	/** Toast description */
	description?: string | ReactNode;
	/** Toast action element */
	action?: ReactNode;
	/** Toast variant */
	variant?: "default" | "destructive";
}

/**
 * Toast state
 */
export interface ToastState {
	/** Array of active toasts */
	toasts: ToasterToast[];
}

/**
 * Toast action types
 */
export const TOAST_ACTIONS = {
	ADD_TOAST: "ADD_TOAST",
	UPDATE_TOAST: "UPDATE_TOAST",
	DISMISS_TOAST: "DISMISS_TOAST",
	REMOVE_TOAST: "REMOVE_TOAST",
} as const;

export type ToastActionType = typeof TOAST_ACTIONS;

/**
 * Toast action union type
 */
export type ToastAction =
	| {
			type: ToastActionType["ADD_TOAST"];
			toast: ToasterToast;
	  }
	| {
			type: ToastActionType["UPDATE_TOAST"];
			toast: Partial<ToasterToast>;
			id: string;
	  }
	| {
			type: ToastActionType["DISMISS_TOAST"];
			toastId?: string;
	  }
	| {
			type: ToastActionType["REMOVE_TOAST"];
			toastId: string;
	  };
