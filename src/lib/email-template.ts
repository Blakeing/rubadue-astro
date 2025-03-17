import type { ContactFormData } from "@/types/forms";
import { escapeHtml, wrapEmailTemplate } from "./email-utils";

export type { ContactFormData };

export function generateContactEmailHtml(data: ContactFormData): string {
	const escapedMessage = escapeHtml(data.message);

	const content = `
    <div class="header">New Contact Form Submission</div>
    
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Message:</strong></p>
    <div class="message-box">${escapedMessage}</div>
    
    <div class="footer">
      This email was sent from the contact form on the Rubadue Wire website.
    </div>`;

	return wrapEmailTemplate(content);
}
