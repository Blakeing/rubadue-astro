# Contact Form with Resend Email Integration

This document explains how the contact form is set up to work with Resend for sending emails.

## Setup

1. **Get a Resend API Key**
   - Sign up at [Resend](https://resend.com)
   - Create an API key from the [API Keys page](https://resend.com/api-keys)

2. **Set up Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your Resend API key to the `.env` file:
     ```
     RESEND_API_KEY=your_resend_api_key_here
     ```

3. **Verify Your Domain (Recommended)**
   - For production use, verify your domain in the Resend dashboard
   - Update the `from` email address in `src/pages/api/contact.ts` to use your verified domain

## How It Works

1. The contact form is implemented in `src/components/react/ContactForm.tsx`
2. When a user submits the form, it sends a POST request to the `/api/contact` endpoint
3. The API endpoint in `src/pages/api/contact.ts` processes the form data and sends an email using Resend
4. Success or error messages are displayed to the user using toast notifications

## Customization

### Email Template

You can customize the email template in `src/pages/api/contact.ts`. The current implementation uses a simple HTML template, but you can enhance it with more styling or a more complex template.

### Form Fields

If you need to add or remove fields from the form:

1. Update the `formSchema` in `src/components/react/ContactForm.tsx`
2. Add or remove the corresponding `FormField` components
3. Update the email template in `src/pages/api/contact.ts` to include the new fields

### Recipients

Update the `to` field in the Resend configuration in `src/pages/api/contact.ts` to change who receives the contact form submissions.

## Troubleshooting

- **Emails not sending**: Check that your Resend API key is correct and that you have sufficient credits
- **Form validation errors**: The form uses Zod for validation; check the validation schema in `ContactForm.tsx`
- **API errors**: Check the browser console and server logs for more detailed error messages

## Resources

- [Resend Documentation](https://resend.com/docs)
- [Astro API Routes Documentation](https://docs.astro.build/en/core-concepts/endpoints/)
- [React Hook Form Documentation](https://react-hook-form.com/) 