import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { InputField } from "@/components/ui/FormFields";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { FormValues } from "./types";
import { wireTypeOptions } from "./types";

import { useFormContext } from "react-hook-form";

/**
 * Props for the product information section
 */
interface ProductInformationProps {
	/** Additional class name for the section */
	className?: string;
}

/**
 * Product information section of the quote request form
 */
export function ProductInformation({ className }: ProductInformationProps) {
	const { control } = useFormContext<FormValues>();

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Product Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6">
				<div className="grid grid-cols-1 gap-3 sm:gap-4">
					<FormField
						control={control}
						name="partNumber"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Part Number</FormLabel>
								<FormControl>
									<Input
										{...field}
										className="font-mono text-sm sm:text-base"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="space-y-3">
					<div className="block text-sm  font-medium">
						Wire Type
					</div>
					<div className="space-y-2">
						{wireTypeOptions.map((option) => (
							<div key={option.id} className="flex items-center gap-2">
								<InputField
									control={control}
									name={`wireTypes.${option.id}`}
									type="checkbox"
									label={option.label}
									className="text-sm sm:text-base"
								/>
							</div>
						))}
					</div>
				</div>

				<div className="grid grid-cols-1 gap-3 sm:gap-4">
					<InputField
						control={control}
						name="message"
						label="Message"
						placeholder="Please provide details about your wire requirements..."
						className="text-sm sm:text-base"
						multiline
						rows={4}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
