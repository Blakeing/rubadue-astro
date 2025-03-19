export function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export function wrapEmailTemplate(content: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .header { font-size: 24px; font-weight: bold; margin-bottom: 20px; }
        .message-box { background: #f5f5f5; padding: 15px; margin: 10px 0; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`;
}
