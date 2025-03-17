/**
 * Escape HTML in user-provided content to prevent XSS
 */
export function escapeHtml(unsafe = ""): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

/**
 * Shared email styles
 */
export const EMAIL_STYLES = `
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
`;

/**
 * Shared email template wrapper
 */
export function wrapEmailTemplate(content: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rubadue Wire</title>
  <style>
    ${EMAIL_STYLES}
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://rubadue.com/static/text-logo.svg" alt="Rubadue Wire" width="200" height="50">
    </div>
    ${content}
  </div>
</body>
</html>`;
}
