import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/react/ui/form";
import { Input } from "@/components/react/ui/input";
import { Button } from "@/components/react/ui/button";
import { Textarea } from "@/components/react/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/react/ui/select";
import { Checkbox } from "@/components/react/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";

const formSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone number is required"),
	streetAddress: z.string().optional(),
	addressLine2: z.string().optional(),
	city: z.string().optional(),
	stateProvince: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.string().refine((val) => val !== "none", {
		message: "Please select a country",
	}),
	jobFunction: z.string().refine((val) => val !== "none", {
		message: "Please select a job function",
	}),
	wireTypes: z
		.object({
			litzWire: z.boolean(),
			windingWire: z.boolean(),
			customCable: z.boolean(),
		})
		.refine((data) => Object.values(data).some(Boolean), {
			message: "At least one wire type must be selected",
		}),
	message: z.string().min(1, "Message is required"),
});

export default function QuoteRequestForm() {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			streetAddress: "",
			addressLine2: "",
			city: "",
			stateProvince: "",
			zipCode: "",
			country: "none",
			jobFunction: "none",
			wireTypes: {
				litzWire: false,
				windingWire: false,
				customCable: false,
			},
			message: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
				throw new Error(responseData.error || "Failed to submit quote request");
			}

			// Show success message
			toast({
				title: "Quote Request Submitted",
				description: "Thank you for your request. We'll be in touch soon.",
			});

			// Reset form
			form.reset();
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description:
					error instanceof Error
						? error.message
						: "There was a problem submitting your request. Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="mx-auto space-y-4 sm:space-y-6"
			>
				<div className="space-y-4 sm:space-y-6">
					<h3 className="text-base sm:text-lg font-medium">
						Personal Information
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										First Name *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="John"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										Last Name *
									</FormLabel>
									<FormControl>
										<Input
											placeholder="Doe"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										Email *
									</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="john.doe@company.com"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										Phone *
									</FormLabel>
									<FormControl>
										<Input
											type="tel"
											placeholder="+1 (555) 000-0000"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="space-y-4 sm:space-y-6">
					<h3 className="text-base sm:text-lg font-medium">Company Address</h3>
					<FormField
						control={form.control}
						name="streetAddress"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm sm:text-base">
									Street Address
								</FormLabel>
								<FormControl>
									<Input
										placeholder="123 Business Street"
										{...field}
										className="text-sm sm:text-base"
									/>
								</FormControl>
								<FormMessage className="text-xs sm:text-sm" />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="addressLine2"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm sm:text-base">
									Address Line 2
								</FormLabel>
								<FormControl>
									<Input
										placeholder="Suite 100"
										{...field}
										className="text-sm sm:text-base"
									/>
								</FormControl>
								<FormMessage className="text-xs sm:text-sm" />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">City</FormLabel>
									<FormControl>
										<Input
											placeholder="New York"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="stateProvince"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										State / Province
									</FormLabel>
									<FormControl>
										<Input
											placeholder="NY"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
						<FormField
							control={form.control}
							name="zipCode"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										ZIP / Postal Code
									</FormLabel>
									<FormControl>
										<Input
											placeholder="10001"
											{...field}
											className="text-sm sm:text-base"
										/>
									</FormControl>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-sm sm:text-base">
										Country *
									</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger className="text-sm sm:text-base">
												<SelectValue placeholder="Select Country" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="none" className="text-sm sm:text-base">
												Select Country
											</SelectItem>
											<SelectItem value="US" className="text-sm sm:text-base">
												United States
											</SelectItem>
											<SelectItem value="CA" className="text-sm sm:text-base">
												Canada
											</SelectItem>
											<SelectItem value="MX" className="text-sm sm:text-base">
												Mexico
											</SelectItem>
											<SelectItem
												value="other"
												className="text-sm sm:text-base"
											>
												Other
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage className="text-xs sm:text-sm" />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<div className="space-y-4 sm:space-y-6">
					<h3 className="text-base sm:text-lg font-medium">
						Professional Information
					</h3>
					<FormField
						control={form.control}
						name="jobFunction"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm sm:text-base">
									Job Function *
								</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger className="text-sm sm:text-base">
											<SelectValue placeholder="Select One" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="none" className="text-sm sm:text-base">
											Select One
										</SelectItem>
										<SelectItem
											value="engineering"
											className="text-sm sm:text-base"
										>
											Engineering
										</SelectItem>
										<SelectItem
											value="purchasing"
											className="text-sm sm:text-base"
										>
											Purchasing
										</SelectItem>
										<SelectItem
											value="management"
											className="text-sm sm:text-base"
										>
											Management
										</SelectItem>
										<SelectItem value="other" className="text-sm sm:text-base">
											Other
										</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage className="text-xs sm:text-sm" />
							</FormItem>
						)}
					/>

					<div className="space-y-2 sm:space-y-3">
						<FormLabel className="text-sm sm:text-base">Wire Type *</FormLabel>
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
							<FormField
								control={form.control}
								name="wireTypes.litzWire"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2 bg-muted/50 p-3 sm:p-4 rounded-lg">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												className="h-4 w-4 sm:h-5 sm:w-5"
											/>
										</FormControl>
										<FormLabel className="!mt-0 text-sm sm:text-base">
											Litz Wire
										</FormLabel>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="wireTypes.windingWire"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2 bg-muted/50 p-3 sm:p-4 rounded-lg">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												className="h-4 w-4 sm:h-5 sm:w-5"
											/>
										</FormControl>
										<FormLabel className="!mt-0 text-sm sm:text-base">
											Winding Wire
										</FormLabel>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="wireTypes.customCable"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2 bg-muted/50 p-3 sm:p-4 rounded-lg">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
												className="h-4 w-4 sm:h-5 sm:w-5"
											/>
										</FormControl>
										<FormLabel className="!mt-0 text-sm sm:text-base">
											Custom Cable
										</FormLabel>
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				<div className="space-y-4 sm:space-y-6">
					<h3 className="text-base sm:text-lg font-medium">Project Details</h3>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-sm sm:text-base">
									Message *
								</FormLabel>
								<FormControl>
									<Textarea
										rows={6}
										placeholder="Please describe your project requirements, specifications, and any other relevant details..."
										{...field}
										className="text-sm sm:text-base"
									/>
								</FormControl>
								<FormMessage className="text-xs sm:text-sm" />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex items-center justify-end pt-2 sm:pt-4">
					<Button
						type="submit"
						disabled={isSubmitting}
						className="text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-4"
					>
						{isSubmitting ? "Submitting..." : "Submit Request"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
