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

	// Provide fallback for optional message
	const escapedMessage = escapeHtml(data.message ?? "");

	const content = `
    <div style="font-size: 24px; font-weight: bold; margin-bottom: 30px; color: #1a1a1a; text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eeeeee;">
      New Quote Request
      <div style="font-size: 16px; font-weight: normal; margin-top: 8px; color: #666666;">
        Submitted on ${new Date().toLocaleDateString()}
      </div>
    </div>
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Personal Information
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td style="width: 50%; padding-right: 20px; vertical-align: top;">
                <p style="margin: 0 0 15px 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Name:</strong>${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
                <p style="margin: 0 0 15px 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Email:</strong>${escapeHtml(data.email)}</p>
              </td>
              <td style="width: 50%; vertical-align: top;">
                <p style="margin: 0 0 15px 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Phone:</strong>${escapeHtml(data.phone ?? "N/A")}</p>
                <p style="margin: 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Job Function:</strong>${escapeHtml(formatJobFunction(data.jobFunction))}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Company Information
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          <p style="margin: 0 0 15px 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Company:</strong>${escapeHtml(data.companyName)}</p>
          <div>
            <strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Address:</strong>
            <div style="line-height: 1.6;">
              ${escapeHtml(data.streetAddress ?? "")}
              ${data.addressLine2 ? `<br/>${escapeHtml(data.addressLine2)}` : ""}
              <br/>${escapeHtml(data.city ?? "")}, ${escapeHtml(data.stateProvince ?? "")} ${escapeHtml(data.zipCode ?? "")}
              <br/>${escapeHtml(formatCountry(data.country ?? "other"))}
            </div>
          </div>
        </td>
      </tr>
    </table>
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Wire Types
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          ${selectedWireTypes.map((type) => `<span style="display: inline-block; background: #e9ecef; padding: 8px 15px; border-radius: 4px; font-size: 14px; margin: 0 15px 15px 0; color: #2a2a2a;">${escapeHtml(type)}</span>`).join("")}
        </td>
      </tr>
    </table>
    
    ${data.partNumber ? `
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Part Number
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          <div style="background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #eeeeee; font-family: 'Courier New', monospace; font-size: 18px; font-weight: bold; color: #2a2a2a; text-align: center;">
            ${escapeHtml(data.partNumber)}
          </div>
          <div style="margin-top: 10px; font-size: 12px; color: #666666; text-align: center;">
            Generated from part number builder
          </div>
        </td>
      </tr>
    </table>
    ` : ''}
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Project Details
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          <div style="background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #eeeeee; line-height: 1.6;">
            ${escapedMessage}
          </div>
        </td>
      </tr>
    </table>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eeeeee; font-size: 12px; color: #666666; text-align: center; line-height: 1.6;">
      This quote request was submitted through the Rubadue Wire website.
    </div>`;

	return wrapEmailTemplate(content);
}
