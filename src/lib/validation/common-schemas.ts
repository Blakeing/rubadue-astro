/**
 * Common Validation Schemas
 * 
 * Shared Zod schemas for common form fields to eliminate duplication
 * and ensure consistency across all forms.
 */

import { z } from "zod";

// Phone number regex for North American format
const phoneRegex = /^\+?1?\s*\(?([0-9]{3})\)?[-.\s]*([0-9]{3})[-.\s]*([0-9]{4})\s*$/;

/**
 * Common field validation schemas
 */
export const commonFields = {
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
    
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
    
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address")
    .max(100, "Email must be less than 100 characters"),
    
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || phoneRegex.test(val),
      "Please enter a valid phone number"
    ),
    
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
    
  message: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length <= 1000,
      "Message must be less than 1000 characters"
    ),
};

/**
 * Personal information schema (name + email + phone)
 */
export const personalInfoSchema = z.object({
  firstName: commonFields.firstName,
  lastName: commonFields.lastName,
  email: commonFields.email,
  phone: commonFields.phone,
});

/**
 * Contact information schema (personal + company)
 */
export const contactInfoSchema = personalInfoSchema.extend({
  companyName: commonFields.companyName,
});

/**
 * Basic contact form schema
 */
export const basicContactSchema = contactInfoSchema.extend({
  message: commonFields.message,
});

/**
 * Utility function to create consistent error messages
 */
export function createFieldError(fieldName: string, errorType: string): string {
  const errorMessages: Record<string, Record<string, string>> = {
    firstName: {
      required: "First name is required",
      tooLong: "First name must be less than 50 characters",
    },
    lastName: {
      required: "Last name is required", 
      tooLong: "Last name must be less than 50 characters",
    },
    email: {
      required: "Email is required",
      invalid: "Invalid email address",
      tooLong: "Email must be less than 100 characters",
    },
    phone: {
      invalid: "Please enter a valid phone number",
    },
    companyName: {
      required: "Company name is required",
      tooLong: "Company name must be less than 100 characters",
    },
    message: {
      tooLong: "Message must be less than 1000 characters",
    },
  };
  
  return errorMessages[fieldName]?.[errorType] || "Invalid input";
}
