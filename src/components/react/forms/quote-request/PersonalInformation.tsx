import { InputField } from "@/components/react/shared/FormFields";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";
import type { FormValues } from "./types";

import { useFormContext } from "react-hook-form";

/**
 * Props for the personal information section
 */
interface PersonalInformationProps {
	/** Additional class name for the section */
	className?: string;
}

/**
 * Personal information section of the quote request form
 */
export function PersonalInformation({ className }: PersonalInformationProps) {
	const { control } = useFormContext<FormValues>();

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Personal Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					<InputField
						control={control}
						name="firstName"
						label="First Name"
						placeholder="John"
						required
						className="text-sm sm:text-base"
					/>
					<InputField
						control={control}
						name="lastName"
						label="Last Name"
						placeholder="Doe"
						required
						className="text-sm sm:text-base"
					/>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
					<InputField
						control={control}
						name="email"
						label="Email"
						placeholder="john.doe@company.com"
						type="email"
						required
						className="text-sm sm:text-base"
					/>
					<InputField
						control={control}
						name="phone"
						label="Phone"
						placeholder="+1 (555) 000-0000"
						type="tel"
						required
						className="text-sm sm:text-base"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
