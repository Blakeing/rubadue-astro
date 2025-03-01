import type { APIRoute } from "astro";
import { Resend } from "resend";
import { generateContactEmailHtml } from "../../lib/email-template";

export const POST: APIRoute = async ({ request }) => {
	const resend = new Resend(import.meta.env.RESEND_API_KEY);

	try {
		const formData = await request.json();
		const { firstName, lastName, email, phone, message } = formData;

		// Generate the email HTML using our template function
		const html = generateContactEmailHtml({
			firstName,
			lastName,
			email,
			phone,
			message,
		});

		// Simple text version as fallback
		const text = `
Message from ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

${message}
`;

		const { data, error } = await resend.emails.send({
			from: "Rubadue Contact <onboarding@resend.dev>", // Using Resend test domain
			to: ["blakeingenthron@gmail.com"], // Update with your email
			subject: `New Contact Form Message from ${firstName} ${lastName}`,
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
				message: "An error occurred",
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
