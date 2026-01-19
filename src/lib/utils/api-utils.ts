/**
 * API Utilities
 * 
 * Shared utilities for API endpoints to eliminate duplicate response handling,
 * error formatting, and email configuration logic.
 */

import type { APIRoute } from "astro";
import { Resend } from "resend";

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

/**
 * Email configuration based on environment
 */
export interface EmailConfig {
  to: string[];
  cc?: string[];
  from: string;
}

/**
 * Gets email configuration based on environment (dev vs prod)
 */
export function getEmailConfig(fromName: string): EmailConfig {
  const isDev = import.meta.env.DEV;
  const toEmail = isDev ? "blakeingenthron@gmail.com" : "sales@rubadue.com";
  
  return {
    to: [toEmail],
    from: `${fromName} <sales@rubadue.com>`,
  };
}

/**
 * Creates a standardized JSON response
 */
export function createJsonResponse<T = any>(
  data: ApiResponse<T>,
  status: number = 200
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Creates a standardized success response
 */
export function createSuccessResponse<T = any>(
  message: string,
  data?: T
): Response {
  return createJsonResponse({ message, data }, 200);
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status: number = 500,
  error?: string
): Response {
  return createJsonResponse({ message, error }, status);
}

/**
 * Handles Resend email sending with standardized error handling
 */
export async function sendEmail(
  resend: Resend,
  emailConfig: EmailConfig,
  subject: string,
  html: string,
  text: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: emailConfig.to,
      ...(emailConfig.cc && { cc: emailConfig.cc }),
      subject,
      html,
      text,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Creates a standardized API route handler with error handling
 */
export function createApiHandler(
  handler: (request: Request) => Promise<Response>
) {
  const POST: APIRoute = async ({ request }) => {
    try {
      return await handler(request);
    } catch (error) {
      console.error("API Error:", error);
      return createErrorResponse(
        "An error occurred processing your request",
        500,
        error instanceof Error ? error.message : String(error)
      );
    }
  };
  
  return { POST };
}

/**
 * Validates request body against a schema
 */
export async function validateRequestBody<T>(
  request: Request,
  validator: (data: any) => T
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const validatedData = validator(body);
    return { success: true, data: validatedData };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Invalid request data",
    };
  }
}

/**
 * Common email template data interface
 */
export interface EmailTemplateData {
  firstName: string;
  lastName: string;
  email: string;
  [key: string]: any;
}

/**
 * Generates simple text version of email from template data
 */
export function generateEmailText(
  title: string,
  data: EmailTemplateData,
  additionalFields?: Record<string, any>
): string {
  let text = `${title}\n`;
  text += `From: ${data.firstName} ${data.lastName}\n`;
  text += `Email: ${data.email}\n`;
  
  if (additionalFields) {
    for (const [key, value] of Object.entries(additionalFields)) {
      if (value) {
        text += `${key}: ${value}\n`;
      }
    }
  }
  
  if (data.message) {
    text += `\nMessage:\n${data.message}`;
  }
  
  return text;
}
