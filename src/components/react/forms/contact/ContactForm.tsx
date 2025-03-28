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
import { type ContactFormProps, type FormValues, formSchema } from "./types";

export function ContactForm({
	onSuccess,
	onError,
	className,
	initialValues,
}: ContactFormProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: initialValues?.firstName ?? "",
			lastName: initialValues?.lastName ?? "",
			email: initialValues?.email ?? "",
			phone: initialValues?.phone ?? "",
			message: initialValues?.message ?? "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const responseData = await response.json();

			if (!response.ok) {
				throw new Error(responseData.error || "Failed to send message");
			}

			toast({
				title: "Message Sent",
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
				aria-label="Contact form"
			>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
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
								<FormLabel>Last Name</FormLabel>
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
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
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
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<Input
										type="tel"
										placeholder="+1 (555) 000-0000"
										{...field}
										disabled={isSubmitting}
										aria-required="true"
									/>
								</FormControl>
								<FormDescription>Format: +1 (XXX) XXX-XXXX</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					control={form.control}
					name="message"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Message</FormLabel>
							<FormControl>
								<Textarea
									rows={6}
									placeholder="How can we help you?"
									{...field}
									disabled={isSubmitting}
									aria-required="true"
								/>
							</FormControl>
							<FormDescription>
								Minimum 10 characters, maximum 1000 characters
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex items-center justify-end pt-4">
					<Button
						type="submit"
						disabled={isSubmitting}
						aria-label={isSubmitting ? "Sending message..." : "Send message"}
					>
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{isSubmitting ? "Sending..." : "Send Message"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
