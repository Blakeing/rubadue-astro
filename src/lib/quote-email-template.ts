export interface QuoteRequestData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	streetAddress?: string;
	addressLine2?: string;
	city?: string;
	stateProvince?: string;
	zipCode?: string;
	country: string;
	jobFunction: string;
	wireTypes: {
		litzWire: boolean;
		windingWire: boolean;
		customCable: boolean;
	};
	message: string;
}

export function generateQuoteRequestEmailHtml(data: QuoteRequestData): string {
	// Escape HTML in user-provided content to prevent XSS
	const escapeHtml = (unsafe = "") => {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};

	// Get selected wire types as a comma-separated list
	const selectedWireTypes = [];
	if (data.wireTypes.litzWire) selectedWireTypes.push("Litz Wire");
	if (data.wireTypes.windingWire) selectedWireTypes.push("Winding Wire");
	if (data.wireTypes.customCable) selectedWireTypes.push("Custom Cable");

	// Format job function for display
	const formatJobFunction = (jobFunction: string) => {
		switch (jobFunction) {
			case "engineering":
				return "Engineering";
			case "purchasing":
				return "Purchasing";
			case "management":
				return "Management";
			case "other":
				return "Other";
			default:
				return jobFunction;
		}
	};

	// Format country for display
	const formatCountry = (country: string) => {
		switch (country) {
			case "US":
				return "United States";
			case "CA":
				return "Canada";
			case "MX":
				return "Mexico";
			case "other":
				return "Other";
			default:
				return country;
		}
	};

	const escapedMessage = escapeHtml(data.message);

	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .header {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 16px;
    }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1px solid #eee;
    }
    .message-box {
      background-color: #f4f4f4;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      white-space: pre-wrap;
    }
    .footer {
      font-size: 12px;
      color: #8898aa;
      margin-top: 24px;
      border-top: 1px solid #cccccc;
      padding-top: 16px;
    }
    .wire-types {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .wire-type {
      background-color: #f0f0f0;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://rubadue.com/static/text-logo.svg" alt="Rubadue Wire" width="200" height="50">
    </div>
    
    <div class="header">New Quote Request</div>
    
    <div class="section">
      <div class="section-title">Personal Information</div>
      <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    </div>
    
    <div class="section">
      <div class="section-title">Company Address</div>
      ${data.streetAddress ? `<p><strong>Street Address:</strong> ${escapeHtml(data.streetAddress)}</p>` : ""}
      ${data.addressLine2 ? `<p><strong>Address Line 2:</strong> ${escapeHtml(data.addressLine2)}</p>` : ""}
      ${data.city ? `<p><strong>City:</strong> ${escapeHtml(data.city)}</p>` : ""}
      ${data.stateProvince ? `<p><strong>State/Province:</strong> ${escapeHtml(data.stateProvince)}</p>` : ""}
      ${data.zipCode ? `<p><strong>ZIP/Postal Code:</strong> ${escapeHtml(data.zipCode)}</p>` : ""}
      <p><strong>Country:</strong> ${escapeHtml(formatCountry(data.country))}</p>
    </div>
    
    <div class="section">
      <div class="section-title">Professional Information</div>
      <p><strong>Job Function:</strong> ${escapeHtml(formatJobFunction(data.jobFunction))}</p>
      <p><strong>Wire Types:</strong></p>
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
    </div>
  </div>
</body>
</html>
  `;
}
