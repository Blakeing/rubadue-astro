import type {
import { Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@/components/react/ui";
	Control,
	FieldPath,
	FieldValues,
	ValidationRule,
	Path,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { useController } from "react-hook-form";

/**
 * Base props for form fields
 */
export interface BaseFieldProps<T extends FieldValues> {
	/** Form control from react-hook-form */
	control: Control<T>;
	/** Field name */
	name: Path<T>;
	/** Field label */
	label: string;
	/** Field placeholder */
	placeholder?: string;
	/** Whether the field is required */
	required?: boolean;
	/** Additional class name for the field */
	className?: string;
}

/**
 * Option for select fields
 */
export interface SelectOption {
	value: string;
	label: string;
}

/**
 * Props for select fields
 */
export interface SelectFieldProps<T extends FieldValues>
	extends BaseFieldProps<T> {
	/** Options for the select field */
	options: SelectOption[];
	/** Callback when value changes */
	onChange?: (value: string) => void;
}

/**
 * Props for input fields
 */
export interface InputFieldProps<T extends FieldValues>
	extends BaseFieldProps<T> {
	/** Input type */
	type?:
		| "text"
		| "email"
		| "tel"
		| "password"
		| "number"
		| "url"
		| "search"
		| "checkbox";
	/** Minimum value for number inputs */
	min?: number;
	/** Maximum value for number inputs */
	max?: number;
	/** Step value for number inputs */
	step?: number;
	/** Input mode */
	inputMode?:
		| "text"
		| "numeric"
		| "decimal"
		| "tel"
		| "email"
		| "url"
		| "search";
	/** Whether the input is a textarea */
	multiline?: boolean;
	/** Number of rows for textarea */
	rows?: number;
	/** Callback when value changes */
	onChange?: (value: string) => void;
	/** Callback when input loses focus */
	onBlur?: () => void;
}

/**
 * Props for custom input fields
 */
export interface CustomInputProps {
	type?: "text" | "number";
	min?: number;
	max?: number;
	step?: number;
	placeholder?: string;
}

/**
 * Props for select fields with custom input
 */
export interface SelectWithCustomInputProps<T extends FieldValues>
	extends SelectFieldProps<T> {
	/** Value that triggers custom input */
	customOptionValue: string;
	/** Whether to show custom input */
	showCustomInput: boolean;
	/** Callback to set show custom input */
	setShowCustomInput: (show: boolean) => void;
	/** Props for custom input */
	customInputProps?: CustomInputProps;
	/** Callback when custom input changes */
	onCustomInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * Select field component
 */
export function SelectField<T extends FieldValues>({
	control,
	name,
	label,
	options,
	required,
	className,
	onChange,
}: SelectFieldProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			rules={{ required: required ? "This field is required" : false }}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel
						className={cn(
							required && "after:content-['*'] after:ml-0.5 after:text-red-500",
						)}
					>
						{label}
					</FormLabel>
					<FormControl>
						<Select
							onValueChange={(value) => {
								field.onChange(value);
								onChange?.(value);
							}}
							defaultValue={field.value}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
							<SelectContent>
								{options.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

/**
 * Input field component
 */
export function InputField<T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	type = "text",
	required,
	className,
	min,
	max,
	step,
	inputMode,
	multiline,
	rows = 3,
	onChange,
	onBlur,
}: InputFieldProps<T>) {
	const isCheckbox = type === "checkbox";

	return (
		<FormField
			control={control}
			name={name}
			rules={{ required: required ? "This field is required" : false }}
			render={({ field }) => (
				<FormItem className={className}>
					{isCheckbox ? (
						<div className="flex items-center gap-2 flex-row-reverse justify-end">
							<FormLabel>{label}</FormLabel>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
									onBlur={field.onBlur}
								/>
							</FormControl>
						</div>
					) : (
						<>
							<FormLabel
								className={cn(
									required &&
										"after:content-['*'] after:ml-0.5 after:text-red-500",
								)}
							>
								{label}
							</FormLabel>
							<FormControl>
								{multiline ? (
									<Textarea
										{...field}
										placeholder={placeholder}
										rows={rows}
										onChange={(e) => {
											field.onChange(e);
											onChange?.(e.target.value);
										}}
										onBlur={() => {
											field.onBlur();
											onBlur?.();
										}}
									/>
								) : (
									<Input
										{...field}
										type={type}
										placeholder={placeholder}
										min={min}
										max={max}
										step={step}
										inputMode={inputMode}
										onChange={(e) => {
											field.onChange(e);
											onChange?.(e.target.value);
										}}
										onBlur={() => {
											field.onBlur();
											onBlur?.();
										}}
									/>
								)}
							</FormControl>
							<FormMessage />
						</>
					)}
				</FormItem>
			)}
		/>
	);
}

/**
 * Select field with custom input component
 */
export function SelectWithCustomInput<T extends FieldValues>({
	control,
	name,
	label,
	options,
	required,
	className,
	onChange,
	customOptionValue,
	showCustomInput,
	setShowCustomInput,
	customInputProps,
	onCustomInputChange,
}: SelectWithCustomInputProps<T>) {
	return (
		<FormField
			control={control}
			name={name}
			rules={{ required: required ? "This field is required" : false }}
			render={({ field }) => (
				<FormItem className={className}>
					<FormLabel
						className={cn(
							required && "after:content-['*'] after:ml-0.5 after:text-red-500",
						)}
					>
						{label}
					</FormLabel>
					<Select
						onValueChange={(value) => {
							field.onChange(value);
							onChange?.(value);
							setShowCustomInput(value === customOptionValue);
						}}
						defaultValue={field.value}
					>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Select an option" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{options.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{showCustomInput && (
						<FormControl>
							<Input
								{...customInputProps}
								onChange={(e) => {
									onCustomInputChange?.(e);
								}}
								className="mt-2"
							/>
						</FormControl>
					)}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
