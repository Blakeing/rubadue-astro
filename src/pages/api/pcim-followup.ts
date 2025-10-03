// Import the new template function
import { generatePcimFollowupEmailHtml } from "@/lib/email-template";
import type { APIRoute } from "astro";
import { Resend } from "resend";

export const POST: APIRoute = async ({ request }) => {
	const resend = new Resend(import.meta.env.RESEND_API_KEY);

	try {
		const formData = await request.json();
		const { firstName, lastName, email, company, message } = formData;

		// TODO: Add validation for formData if necessary

		// Generate HTML using the new template function
		const html = generatePcimFollowupEmailHtml({
			firstName,
			lastName,
			email,
			company,
			message,
		});

		// Simple text version
		const text = `
PCIM Follow-up from ${firstName} ${lastName}
Email: ${email}
Company: ${company}

Message:
${message || "No additional message provided."}
`;

		// Use different email addresses for development vs production
		const isDev = import.meta.env.DEV;
		const toEmail = isDev ? "blakeingenthron@gmail.com" : "sales@rubadue.com";
		const ccEmail = isDev ? undefined : "blakeingenthron@gmail.com";
		
		const { data, error } = await resend.emails.send({
			from: "PCIM Follow-Up Form <sales@rubadue.com>",
			to: [toEmail],
			...(ccEmail && { cc: [ccEmail] }),
			subject: `PCIM Follow-up from ${firstName} ${lastName} (${company})`,
			html: html,
			text: text,
		});

		if (error) {
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
				message: "Message sent successfully",
				data,
			}),
			{
				status: 200,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		return new Response(
			JSON.stringify({
				message: "An error occurred processing your request",
				error: error instanceof Error ? error.message : String(error),
			}),
			{
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
	}
};
