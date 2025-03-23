import { Button, Input } from "@/components/react/ui";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Loader2, Search, X } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

const searchInputStyles = `
  [type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
  }
  [type="search"]::-ms-clear {
    display: none;
  }
`;

/**
 * Props for the table search component
 */
interface TableSearchProps {
	/** The current search value */
	value: string;
	/** Callback to update the search value */
	onChange: (value: string) => void;
	/** Placeholder text for the search input */
	placeholder?: string;
	/** Additional class name for the search input */
	className?: string;
	/** Additional class name for the search input wrapper */
	wrapperClassName?: string;
	/** Whether to disable the search input */
	disabled?: boolean;
	/** Whether to autofocus the search input */
	autoFocus?: boolean;
	/** Whether the search is in a loading state */
	isLoading?: boolean;
	/** Callback when search is submitted */
	onSubmit?: (value: string) => void;
	/** Callback when search is cleared */
	onClear?: () => void;
	/** Callback when search is focused */
	onFocus?: () => void;
	/** Callback when search is blurred */
	onBlur?: () => void;
	/** Whether to show the search icon */
	showSearchIcon?: boolean;
	/** Whether to show the clear button */
	showClearButton?: boolean;
	/** Whether to show the loading indicator */
	showLoadingIndicator?: boolean;
	/** The ARIA label for the search input */
	ariaLabel?: string;
	/** The ARIA description for the search input */
	ariaDescription?: string;
	/** Delay in milliseconds before triggering the search */
	debounceDelay?: number;
}

/**
 * A search input component for tables with keyboard shortcuts and accessibility features
 * @param props - Component props
 * @returns A search input component with wrapper
 *
 * @example
 * ```tsx
 * <TableSearch
 *   value={searchTerm}
 *   onChange={setSearchTerm}
 *   placeholder="Search users..."
 *   onSubmit={handleSearch}
 *   onClear={handleClear}
 * />
 * ```
 */
export function TableSearch({
	value,
	onChange,
	placeholder = "Search all columns...",
	className,
	wrapperClassName,
	disabled = false,
	autoFocus = false,
	isLoading = false,
	onSubmit,
	onClear,
	onFocus,
	onBlur,
	showSearchIcon = true,
	showClearButton = true,
	showLoadingIndicator = true,
	ariaLabel,
	ariaDescription,
	debounceDelay = 300,
}: TableSearchProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [isFocused, setIsFocused] = React.useState(false);
	const [localValue, setLocalValue] = React.useState(value);
	const [isDebouncing, setIsDebouncing] = React.useState(false);

	// Validate required props
	if (typeof onChange !== "function") {
		throw new Error("onChange must be a function");
	}

	// Update local value when prop changes
	React.useEffect(() => {
		setLocalValue(value);
	}, [value]);

	const debouncedOnChange = useDebouncedCallback((newValue: string) => {
		onChange(newValue);
		setIsDebouncing(false);
	}, debounceDelay);

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value;
			setLocalValue(newValue);
			setIsDebouncing(true);
			debouncedOnChange(newValue);
		},
		[debouncedOnChange],
	);

	const handleClear = React.useCallback(() => {
		setLocalValue("");
		setIsDebouncing(false);
		onChange("");
		inputRef.current?.focus();
		onClear?.();
	}, [onChange, onClear]);

	const handleSubmit = React.useCallback(
		(event: React.FormEvent) => {
			event.preventDefault();
			setIsDebouncing(false);
			onSubmit?.(localValue);
		},
		[onSubmit, localValue],
	);

	const handleFocus = React.useCallback(() => {
		setIsFocused(true);
		onFocus?.();
	}, [onFocus]);

	const handleBlur = React.useCallback(() => {
		setIsFocused(false);
		onBlur?.();
	}, [onBlur]);

	// Add keyboard shortcuts for search focus and navigation
	React.useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			// Only handle keyboard shortcuts if not in an input or textarea
			if (
				event.target instanceof HTMLInputElement ||
				event.target instanceof HTMLTextAreaElement
			) {
				return;
			}

			// Focus search with '/'
			if (
				event.key === "/" &&
				!event.ctrlKey &&
				!event.metaKey &&
				!event.altKey &&
				!event.shiftKey &&
				!isFocused
			) {
				event.preventDefault();
				inputRef.current?.focus();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isFocused]);

	// Handle Escape and Enter when focused
	const handleInputKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === "Escape") {
				event.preventDefault();
				handleClear();
			} else if (event.key === "Enter") {
				event.preventDefault();
				handleSubmit(event);
			}
		},
		[handleClear, handleSubmit],
	);

	const showLoading = isLoading || isDebouncing;

	return (
		<form
			className={cn("flex items-center py-4", wrapperClassName)}
			onSubmit={handleSubmit}
		>
			<style>{searchInputStyles}</style>
			<div className="relative w-full">
				{showSearchIcon && (
					<Search
						className={cn(
							"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors",
							isFocused ? "text-foreground" : "text-muted-foreground",
						)}
						aria-hidden="true"
					/>
				)}
				<Input
					ref={inputRef}
					type="search"
					placeholder={placeholder}
					value={localValue}
					onChange={handleChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleInputKeyDown}
					className={cn(
						showSearchIcon && "pl-9",
						(showClearButton || showLoadingIndicator) && "pr-8",
						showLoading && showLoadingIndicator && "pr-12",
						localValue && showClearButton && "pr-16",
						className,
					)}
					disabled={disabled || isLoading}
					autoFocus={autoFocus}
					aria-label={ariaLabel || placeholder}
					aria-describedby={ariaDescription ? "search-description" : undefined}
					aria-busy={showLoading}
					autoComplete="off"
					spellCheck="false"
				/>
				{ariaDescription && (
					<div id="search-description" className="sr-only">
						{ariaDescription}
					</div>
				)}
				<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-x-1">
					{showLoading && showLoadingIndicator && (
						<Loader2
							className="h-4 w-4 animate-spin text-muted-foreground"
							aria-hidden="true"
						/>
					)}
					{localValue && showClearButton && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="h-6 w-6 p-0 hover:bg-transparent"
							onClick={handleClear}
							disabled={disabled || isLoading}
							aria-label="Clear search"
						>
							<X
								className={cn(
									"h-4 w-4 transition-colors",
									isFocused ? "text-foreground" : "text-muted-foreground",
									"hover:text-foreground",
								)}
							/>
						</Button>
					)}
				</div>
			</div>
		</form>
	);
}
