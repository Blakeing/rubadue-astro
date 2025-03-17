import type { QuoteRequestData } from "@/types/forms";
import { WIRE_TYPES, WIRE_TYPE_NAMES } from "@/types/forms";
import { escapeHtml, wrapEmailTemplate } from "./email-utils";
import { formatCountry, formatJobFunction } from "./format-utils";

export type { QuoteRequestData };

export function generateQuoteRequestEmailHtml(data: QuoteRequestData): string {
	// Get selected wire types
	const selectedWireTypes = Object.entries(data.wireTypes)
		.filter(([_, isSelected]) => isSelected)
		.map(([type]) => WIRE_TYPE_NAMES[type as keyof typeof WIRE_TYPE_NAMES]);

	const escapedMessage = escapeHtml(data.message);

	const content = `
    <div class="header">New Quote Request</div>
    
    <div class="section">
      <div class="section-title">Personal Information</div>
      <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
      <p><strong>Job Function:</strong> ${escapeHtml(formatJobFunction(data.jobFunction))}</p>
    </div>
    
    <div class="section">
      <div class="section-title">Company Information</div>
      <p><strong>Company:</strong> ${escapeHtml(data.companyName)}</p>
      <p><strong>Address:</strong> ${escapeHtml(data.streetAddress)}</p>
      ${data.addressLine2 ? `<p><strong>Address Line 2:</strong> ${escapeHtml(data.addressLine2)}</p>` : ""}
      <p><strong>City:</strong> ${escapeHtml(data.city)}</p>
      <p><strong>State/Province:</strong> ${escapeHtml(data.stateProvince)}</p>
      <p><strong>ZIP/Postal Code:</strong> ${escapeHtml(data.zipCode)}</p>
      <p><strong>Country:</strong> ${escapeHtml(formatCountry(data.country))}</p>
    </div>
    
    <div class="section">
      <div class="section-title">Wire Types</div>
      <div class="wire-types">
        ${selectedWireTypes.map((type) => `<span class="wire-type">${escapeHtml(type)}</span>`).join(" ")}
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Project Details</div>
      <div class="message-box">${escapedMessage}</div>
    </div>
    
    <div class="footer">
      This email was sent from the quote request form on the Rubadue Wire website.
    </div>`;

	return wrapEmailTemplate(content);
}
