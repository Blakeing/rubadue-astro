import type { APIRoute } from "astro";
import { Resend } from "resend";
import { generateQuoteRequestEmailHtml } from "../../lib/quote-email-template";

export const POST: APIRoute = async ({ request }) => {
	const resend = new Resend(import.meta.env.RESEND_API_KEY);

	try {
		const formData = await request.json();
		const {
			firstName,
			lastName,
			email,
			phone,
			streetAddress,
			addressLine2,
			city,
			stateProvince,
			zipCode,
			country,
			jobFunction,
			wireTypes,
			message,
		} = formData;

		// Generate the email HTML using our template function
		const html = generateQuoteRequestEmailHtml({
			firstName,
			lastName,
			email,
			phone,
			streetAddress,
			addressLine2,
			city,
			stateProvince,
			zipCode,
			country,
			jobFunction,
			wireTypes,
			message,
		});

		// Simple text version as fallback
		const text = `
Quote Request from ${firstName} ${lastName}

Personal Information:
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Company Address:
${streetAddress ? `Street Address: ${streetAddress}` : ""}
${addressLine2 ? `Address Line 2: ${addressLine2}` : ""}
${city ? `City: ${city}` : ""}
${stateProvince ? `State/Province: ${stateProvince}` : ""}
${zipCode ? `ZIP/Postal Code: ${zipCode}` : ""}
Country: ${country}

Professional Information:
Job Function: ${jobFunction}
Wire Types: ${wireTypes.litzWire ? "Litz Wire, " : ""}${wireTypes.windingWire ? "Winding Wire, " : ""}${wireTypes.customCable ? "Custom Cable" : ""}

Project Details:
${message}
`;

		const { data, error } = await resend.emails.send({
			from: "Rubadue Quote Request <onboarding@resend.dev>", // Using Resend test domain
			to: ["blakeingenthron@gmail.com"], // Update with your email
			subject: `New Quote Request from ${firstName} ${lastName}`,
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
				message: "Quote request submitted successfully",
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
