export interface ContactFormData {
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	message: string;
}

export function generateContactEmailHtml(data: ContactFormData): string {
	// Escape HTML in user-provided content to prevent XSS
	const escapeHtml = (unsafe: string) => {
		return unsafe
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;");
	};

	const escapedMessage = escapeHtml(data.message);

	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
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
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://rubadue.com/static/text-logo.svg" alt="Rubadue Wire" width="200" height="50">
    </div>
    
    <div class="header">New Contact Form Submission</div>
    
    <p><strong>Name:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</p>
    <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
    <p><strong>Message:</strong></p>
    <div class="message-box">${escapedMessage}</div>
    
    <div class="footer">
      This email was sent from the contact form on the Rubadue Wire website.
    </div>
  </div>
</body>
</html>
  `;
}
