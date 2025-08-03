import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CompanyAddress } from "./CompanyAddress";
import { JobInformation } from "./JobInformation";
import { PersonalInformation } from "./PersonalInformation";
import type { FormValues, QuoteRequestFormProps } from "./types";
import { formSchema } from "./types";

import { useToast } from "@/hooks/use-toast";

/**
 * Quote request form component
 */
export function QuoteRequestForm({
	initialValues,
	onSuccess,
	onError,
	className,
}: QuoteRequestFormProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: initialValues?.firstName || "",
			lastName: initialValues?.lastName || "",
			email: initialValues?.email || "",
			phone: initialValues?.phone || "",
			companyName: initialValues?.companyName || "",
			streetAddress: initialValues?.streetAddress || "",
			addressLine2: initialValues?.addressLine2 || "",
			city: initialValues?.city || "",
			stateProvince: initialValues?.stateProvince || "",
			zipCode: initialValues?.zipCode || "",
			country: initialValues?.country || undefined,
			jobFunction: initialValues?.jobFunction || undefined,
			wireTypes: {
				litzWire: initialValues?.wireTypes?.litzWire || false,
				windingWire: initialValues?.wireTypes?.windingWire || false,
				customCable: initialValues?.wireTypes?.customCable || false,
			},
			message: initialValues?.message || "",
		},
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const handleSubmit = form.handleSubmit(
		async (data) => {
			if (isSubmitting) return;
			setIsSubmitting(true);

			try {
				const response = await fetch("/api/quote-request", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				});

				const responseData = await response.json();

				if (!response.ok) {
					throw new Error(
						responseData.error || "Failed to submit quote request",
					);
				}

				// Show success message
				toast({
					title: "Quote Request Submitted",
					description: "Thank you for your request. We'll be in touch soon.",
				});

				// Reset form
				form.reset();

				// Call onSuccess callback if provided
				await onSuccess?.(data);
			} catch (error) {
				toast({
					title: "Error",
					description:
						error instanceof Error
							? error.message
							: "There was a problem submitting your request. Please try again.",
				});
				onError?.(error instanceof Error ? error : new Error(String(error)));
			} finally {
				setIsSubmitting(false);
			}
		},
		(errors) => {
			toast({
				title: "Error",
				description: "Please fill in all required fields correctly.",
			});
		},
	);

	return (
		<Form {...form}>
			<form onSubmit={handleSubmit} className={className}>
				<div className="space-y-8">
					<PersonalInformation />
					<CompanyAddress />
					<JobInformation />

					{form.formState.errors.root && (
						<Alert variant="destructive">
							<AlertDescription>
								{form.formState.errors.root.message}
							</AlertDescription>
						</Alert>
					)}

					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit Request"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
