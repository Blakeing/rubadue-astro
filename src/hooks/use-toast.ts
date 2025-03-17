"use client";

import type {
	ToastAction,
	ToastActionType,
	ToastState,
	ToasterToast,
} from "@/types/hooks";
import { TOAST_ACTIONS } from "@/types/hooks";
// Inspired by react-hot-toast library
import * as React from "react";

/**
 * Maximum number of toasts to show at once
 */
const TOAST_LIMIT = 1;

/**
 * Time in milliseconds before a toast is removed
 */
const TOAST_REMOVE_DELAY = 5000;

/**
 * Map of toast IDs to their removal timeouts
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * Array of state update listeners
 */
const listeners: Array<(state: ToastState) => void> = [];

/**
 * Current state in memory
 */
let memoryState: ToastState = { toasts: [] };

/**
 * Counter for generating unique toast IDs
 */
let count = 0;

/**
 * Generate a unique ID for a toast
 */
function genId(): string {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

/**
 * Add a toast to the removal queue
 */
function addToRemoveQueue(toastId: string): void {
	if (toastTimeouts.has(toastId)) {
		return;
	}

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: TOAST_ACTIONS.REMOVE_TOAST,
			toastId: toastId,
		});
	}, TOAST_REMOVE_DELAY);

	toastTimeouts.set(toastId, timeout);
}

/**
 * Dispatch a toast action to update state
 */
function dispatch(action: ToastAction): void {
	memoryState = reducer(memoryState, action);
	for (const listener of listeners) {
		listener(memoryState);
	}
}

/**
 * Reducer function for handling toast actions
 */
function reducer(state: ToastState, action: ToastAction): ToastState {
	switch (action.type) {
		case TOAST_ACTIONS.ADD_TOAST:
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case TOAST_ACTIONS.UPDATE_TOAST:
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === action.id ? { ...t, ...action.toast } : t,
				),
			};

		case TOAST_ACTIONS.DISMISS_TOAST: {
			const { toastId } = action;

			// Handle toast removal
			if (toastId) {
				addToRemoveQueue(toastId);
			} else {
				for (const toast of state.toasts) {
					addToRemoveQueue(toast.id);
				}
			}

			return {
				...state,
				toasts: state.toasts.map((t) =>
					t.id === toastId || toastId === undefined
						? {
								...t,
								open: false,
							}
						: t,
				),
			};
		}

		case TOAST_ACTIONS.REMOVE_TOAST:
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t.id !== action.toastId),
			};
	}
}

/**
 * Create a new toast
 */
function toast(props: Omit<ToasterToast, "id">): {
	id: string;
	dismiss: () => void;
	update: (props: ToasterToast) => void;
} {
	const id = genId();

	const update = (props: ToasterToast) =>
		dispatch({
			type: TOAST_ACTIONS.UPDATE_TOAST,
			id,
			toast: props,
		});

	const dismiss = () =>
		dispatch({ type: TOAST_ACTIONS.DISMISS_TOAST, toastId: id });

	dispatch({
		type: TOAST_ACTIONS.ADD_TOAST,
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open) => {
				if (!open) dismiss();
			},
		},
	});

	return {
		id,
		dismiss,
		update,
	};
}

/**
 * Hook for managing toasts
 */
export function useToast() {
	const [state, setState] = React.useState<ToastState>(memoryState);

	React.useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, []);

	return {
		...state,
		toast,
		dismiss: (toastId?: string) =>
			dispatch({ type: TOAST_ACTIONS.DISMISS_TOAST, toastId }),
	};
}

export { toast };
