import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { InputField, SelectField } from "@/components/ui/FormFields";
import type { FormValues } from "./types";
import { countries } from "./types";

import { useFormContext } from "react-hook-form";

/**
 * Props for the company address section
 */
interface CompanyAddressProps {
	/** Additional class name for the section */
	className?: string;
}

/**
 * Company address section of the quote request form
 */
export function CompanyAddress({ className }: CompanyAddressProps) {
	const { control } = useFormContext<FormValues>();

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Company Address</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6">
				<div className="grid grid-cols-1 gap-3 sm:gap-4">
					<InputField
						control={control}
						name="companyName"
						label="Company Name"
						placeholder="Company Inc."
						className="text-sm sm:text-base"
					/>
					<InputField
						control={control}
						name="streetAddress"
						label="Street Address"
						placeholder="123 Main St"
						className="text-sm sm:text-base"
					/>
					<InputField
						control={control}
						name="addressLine2"
						label="Address Line 2"
						placeholder="Suite 100"
						className="text-sm sm:text-base"
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					<InputField
						control={control}
						name="city"
						label="City"
						placeholder="New York"
						className="text-sm sm:text-base"
					/>
					<InputField
						control={control}
						name="stateProvince"
						label="State/Province"
						placeholder="NY"
						className="text-sm sm:text-base"
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					<InputField
						control={control}
						name="zipCode"
						label="Postal Code"
						placeholder="10001"
						className="text-sm sm:text-base"
					/>
					<SelectField
						control={control}
						name="country"
						label="Country"
						options={[...countries]}
						className="text-sm sm:text-base"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
