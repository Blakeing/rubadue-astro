import type { Control, FieldPath, FieldValues } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/react/ui/form";
import { Input } from "@/components/react/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui/select";

// Generic type for form data
type FormDataType = Record<string, unknown>;

// Reusable SelectField component
export const SelectField = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	options,
	onChange = undefined,
	className,
}: {
	control: Control<T>;
	name: FieldPath<T>;
	label: string;
	placeholder: string;
	options: Array<{ value: string; label: string }>;
	onChange?: (value: string) => void;
	className?: string;
}) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel>{label}</FormLabel>
				<Select
					onValueChange={(value) => {
						// Always update the form value
						field.onChange(value);

						// Call custom onChange if provided
						if (onChange) {
							onChange(value);
						}
					}}
					defaultValue={field.value as string}
				>
					<FormControl>
						<SelectTrigger>
							<SelectValue placeholder={placeholder} />
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
				<FormMessage />
			</FormItem>
		)}
	/>
);

// Reusable InputField component
export const InputField = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	type = "text",
	min = undefined,
	max = undefined,
	step = undefined,
	inputMode = undefined,
	onChange = undefined,
	onBlur = undefined,
	className,
	inputClassName,
}: {
	control: Control<T>;
	name: FieldPath<T>;
	label: string;
	placeholder: string;
	type?: string;
	min?: string | number;
	max?: string | number;
	step?: string | number;
	inputMode?: "numeric" | "text" | undefined;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: () => void;
	className?: string;
	inputClassName?: string;
}) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel>{label}</FormLabel>
				<FormControl>
					<Input
						type={type}
						min={min}
						max={max}
						step={step}
						inputMode={inputMode}
						placeholder={placeholder}
						className={inputClassName}
						{...field}
						value={field.value as string}
						onChange={(e) => {
							// Always update the form value
							field.onChange(e);

							// Call custom onChange if provided
							if (onChange) {
								onChange(e);
							}
						}}
						onBlur={(e) => {
							// Always call the default onBlur
							field.onBlur();

							// Call custom onBlur if provided
							if (onBlur) {
								onBlur();
							}
						}}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

// SelectWithCustomInput component for fields that can have a custom input option
export const SelectWithCustomInput = <T extends FieldValues>({
	control,
	name,
	label,
	placeholder,
	options,
	customOptionValue,
	showCustomInput,
	setShowCustomInput,
	customInputProps,
	onCustomInputChange,
	className,
}: {
	control: Control<T>;
	name: FieldPath<T>;
	label: string;
	placeholder: string;
	options: Array<{ value: string; label: string }>;
	customOptionValue: string;
	showCustomInput: boolean;
	setShowCustomInput: (show: boolean) => void;
	customInputProps?: {
		type?: string;
		min?: string | number;
		max?: string | number;
		step?: string | number;
		placeholder?: string;
		inputMode?: "numeric" | "text" | undefined;
		className?: string;
	};
	onCustomInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	className?: string;
}) => (
	<FormField
		control={control}
		name={name}
		render={({ field }) => (
			<FormItem className={className}>
				<FormLabel>{label}</FormLabel>
				<div className="space-y-2">
					<Select
						onValueChange={(value) => {
							if (value === customOptionValue) {
								setShowCustomInput(true);
								// Clear the field value when switching to custom input
								field.onChange("");
							} else {
								setShowCustomInput(false);
								// Update the field value with the selected option
								field.onChange(value);
							}
						}}
						defaultValue={field.value as string}
					>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder={placeholder} />
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
								type={customInputProps?.type || "text"}
								min={customInputProps?.min}
								max={customInputProps?.max}
								step={customInputProps?.step}
								inputMode={customInputProps?.inputMode}
								placeholder={
									customInputProps?.placeholder || "Enter custom value"
								}
								className={customInputProps?.className}
								onChange={onCustomInputChange}
							/>
						</FormControl>
					)}
				</div>
				<FormMessage />
			</FormItem>
		)}
	/>
);
