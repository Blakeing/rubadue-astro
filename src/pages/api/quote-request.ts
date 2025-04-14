import { generateQuoteRequestEmailHtml } from "@/lib/quote-email-template";
import type { APIRoute } from "astro";
import { Resend } from "resend";
import { z } from "zod";
import {
	COUNTRIES,
	JOB_FUNCTIONS,
	type QuoteRequestData,
	type Country,
	type JobFunction,
} from "@/types/forms";

// Create literal types for the enums
const countryValues = COUNTRIES.map((c) => c.value) as readonly Country[];
const jobFunctionValues = JOB_FUNCTIONS.map(
	(j) => j.value,
) as readonly JobFunction[];

// Email validation schema
const emailSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().optional(),
	companyName: z.string().min(1, "Company name is required"),
	streetAddress: z.string().optional(),
	addressLine2: z.string().optional(),
	city: z.string().optional(),
	stateProvince: z.string().optional(),
	zipCode: z.string().optional(),
	country: z.enum(countryValues as [Country, ...Country[]]).optional(),
	jobFunction: z.enum(jobFunctionValues as [JobFunction, ...JobFunction[]], {
		required_error: "Job function is required",
		invalid_type_error: "Please select a valid job function",
	}),
	wireTypes: z
		.object({
			litzWire: z.boolean(),
			windingWire: z.boolean(),
			customCable: z.boolean(),
		})
		.refine((data) => data.litzWire || data.windingWire || data.customCable, {
			message: "Please select at least one wire type",
		}),
	message: z.string().optional(),
}) satisfies z.ZodType<QuoteRequestData>;

export const POST: APIRoute = async ({ request }) => {
	const resend = new Resend(import.meta.env.RESEND_API_KEY);

	try {
		const data = await request.json();

		// Validate the request data
		const validatedData = emailSchema.parse(data) as QuoteRequestData;

		// Generate the email HTML using our template function
		const html = generateQuoteRequestEmailHtml(validatedData);

		// Format wire types for text version
		const selectedWireTypes = Object.entries(validatedData.wireTypes)
			.filter(([_, value]) => value)
			.map(([key]) => key.replace(/([A-Z])/g, " $1").toLowerCase())
			.join(", ");

		// Simple text version as fallback
		const text = `
New Quote Request

Personal Information:
-------------------
Name: ${validatedData.firstName} ${validatedData.lastName}
Email: ${validatedData.email}
Phone: ${validatedData.phone}
Company: ${validatedData.companyName}

Company Address:
--------------
${validatedData.streetAddress}
${validatedData.addressLine2 ? `${validatedData.addressLine2}\n` : ""}
${validatedData.city}, ${validatedData.stateProvince} ${validatedData.zipCode}
${validatedData.country}

Job Information:
--------------
Job Function: ${validatedData.jobFunction}
Wire Types: ${selectedWireTypes}

Message:
-------
${validatedData.message}
		`.trim();

		const { data: emailData, error } = await resend.emails.send({
			from: "Rubadue Quote Request <sales@rubadue.com>", // Update with your verified domain
			to: ["sales@rubadue.com"],
			cc: ["blakeingenthron@gmail.com"], // Update with your email
			subject: `New Quote Request from ${validatedData.firstName} ${validatedData.lastName}`,
			html: html,
			text: text,
		});

		if (error) {
			console.error("Resend error:", error);
			return new Response(
				JSON.stringify({
					message: "Failed to send email",
					error: error.message,
				}),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		return new Response(
			JSON.stringify({
				message: "Quote request received successfully",
				data: emailData,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error("Error processing quote request:", error);
		return new Response(
			JSON.stringify({
				message:
					error instanceof Error ? error.message : "Internal server error",
			}),
			{
				status: 400,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
