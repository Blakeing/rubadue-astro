import type { ContactFormData, PcimFollowupFormData } from "@/types/forms";
import { escapeHtml, wrapEmailTemplate } from "./email-utils";

export type { ContactFormData, PcimFollowupFormData };

export function generateContactEmailHtml(data: ContactFormData): string {
	const escapedMessage = escapeHtml(data.message ?? "");

	const content = `
    <div style="font-size: 24px; font-weight: bold; margin-bottom: 30px; color: #1a1a1a; text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eeeeee;">
      New Contact Form Submission
      <div style="font-size: 16px; font-weight: normal; margin-top: 8px; color: #666666;">
        Submitted on ${new Date().toLocaleDateString()}
      </div>
    </div>
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Contact Information
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
                <p style="margin: 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Phone:</strong>${escapeHtml(data.phone ?? "N/A")}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Message
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
      This contact form was submitted through the Rubadue Wire website.
    </div>`;

	return wrapEmailTemplate(content);
}

export function generatePcimFollowupEmailHtml(
	data: PcimFollowupFormData,
): string {
	const escapedMessage = escapeHtml(data.message ?? "");

	const content = `
    <div style="font-size: 24px; font-weight: bold; margin-bottom: 30px; color: #1a1a1a; text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eeeeee;">
      New PCIM Follow-Up Submission
      <div style="font-size: 16px; font-weight: normal; margin-top: 8px; color: #666666;">
        Submitted on ${new Date().toLocaleDateString()}
      </div>
    </div>
    
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Contact Information
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          <table cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
            <tr>
              <td style="width: 50%; padding-right: 20px; vertical-align: top;">
                <p style="margin: 0 0 15px 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Name:</strong>${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
                <p style="margin: 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Company:</strong>${escapeHtml(data.company)}</p> 
              </td>
              <td style="width: 50%; vertical-align: top;">
                <p style="margin: 0;"><strong style="color: #2a2a2a; display: block; margin-bottom: 5px;">Email:</strong>${escapeHtml(data.email)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    ${
			data.message
				? `
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-bottom: 30px; background: #f9f9f9; border-radius: 8px; padding: 20px;">
      <tr>
        <td style="font-size: 18px; font-weight: bold; color: #2a2a2a; padding-bottom: 15px; border-bottom: 2px solid #eeeeee;">
          Message
        </td>
      </tr>
      <tr>
        <td style="padding-top: 15px;">
          <div style="background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #eeeeee; line-height: 1.6;">
            ${escapedMessage}
          </div>
        </td>
      </tr>
    </table>`
				: ""
		}
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eeeeee; font-size: 12px; color: #666666; text-align: center; line-height: 1.6;">
      This form was submitted through the PCIM Follow-up page on the Rubadue Wire website.
    </div>`;

	return wrapEmailTemplate(content);
}
