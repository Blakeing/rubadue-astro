import { InputField, SelectField } from "@/components/react/shared/FormFields";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/react/ui";
import type { FormValues } from "./types";
import { jobFunctions, wireTypeOptions } from "./types";

import { useFormContext } from "react-hook-form";

/**
 * Props for the job information section
 */
interface JobInformationProps {
	/** Additional class name for the section */
	className?: string;
}

/**
 * Job information section of the quote request form
 */
export function JobInformation({ className }: JobInformationProps) {
	const { control } = useFormContext<FormValues>();

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Job Information</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 sm:space-y-6">
				<div className="grid grid-cols-1 gap-3 sm:gap-4">
					<SelectField
						control={control}
						name="jobFunction"
						label="Job Function"
						options={[...jobFunctions]}
						className="text-sm sm:text-base"
					/>
				</div>

				<div className="space-y-3">
					<div className="block text-sm sm:text-base font-medium">
						Wire Types
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
