import { Button } from "@/components/react/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/react/ui/form";
import { Input } from "@/components/react/ui/input";
import { Textarea } from "@/components/react/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
	type PcimFormProps,
	type PcimFormValues,
	pcimFormSchema,
} from "./types";

export function PcimForm({
	onSuccess,
	onError,
	className,
	initialValues,
}: PcimFormProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<PcimFormValues>({
		resolver: zodResolver(pcimFormSchema),
		defaultValues: {
			firstName: initialValues?.firstName ?? "",
			lastName: initialValues?.lastName ?? "",
			email: initialValues?.email ?? "",
			company: initialValues?.company ?? "",
			message: initialValues?.message ?? "",
		},
	});

	// Update onSubmit to use the new API endpoint
	const onSubmit = async (data: PcimFormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/pcim-followup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();

			if (!response.ok) {
				// Use error message from API response if available
				throw new Error(
					responseData.error ||
						responseData.message ||
						"Failed to send message",
				);
			}

			toast({
				title: "Message Sent Successfully",
				description: "Thank you for your message. We'll be in touch soon.",
			});

			form.reset();
			onSuccess?.();
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "There was a problem sending your message";

			toast({
				variant: "destructive",
				title: "Error",
				description: errorMessage,
			});

			onError?.(error instanceof Error ? error : new Error(errorMessage));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className={cn("space-y-6", className)}
				aria-label="PCIM Europe Follow-Up Form"
			>
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								First Name<span className="text-destructive"> *</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="John"
									{...field}
									disabled={isSubmitting}
									aria-required="true"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Last Name<span className="text-destructive"> *</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Doe"
									{...field}
									disabled={isSubmitting}
									aria-required="true"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Email<span className="text-destructive"> *</span>
							</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="john.doe@company.com"
									{...field}
									disabled={isSubmitting}
									aria-required="true"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="company"
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Company<span className="text-destructive"> *</span>
							</FormLabel>
							<FormControl>
								<Input
									placeholder="Your Company Inc."
									{...field}
									disabled={isSubmitting}
									aria-required="true"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message / Topic</FormLabel>
							<FormControl>
								<Textarea
									rows={4}
									placeholder="Let us know what you'd like to discuss..."
									{...field}
									disabled={isSubmitting}
									aria-required="false" // Message is optional
								/>
							</FormControl>
							<FormDescription>
								Optional: Briefly mention topics or products of interest.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex items-center justify-end pt-4">
					<Button
						type="submit"
						disabled={isSubmitting}
						aria-label={
							isSubmitting ? "Submitting request..." : "Schedule Meeting"
						}
					>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isSubmitting ? "Submitting..." : "Submit"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
