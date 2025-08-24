/**
 * Form Utilities
 * 
 * Shared utilities for form handling, submission, and error management.
 * Consolidates duplicate form logic across components.
 */

import { toast } from "@/hooks/use-toast";

/**
 * Standard form submission options
 */
export interface FormSubmissionOptions<T = any> {
  endpoint: string;
  data: T;
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: Error) => void;
}

/**
 * Standard API response format
 */
export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  error?: string;
}

/**
 * Handles form submission with standardized error handling and toast notifications
 */
export async function submitForm<T = any>({
  endpoint,
  data,
  successTitle = "Success",
  successDescription = "Your request has been submitted successfully.",
  errorTitle = "Error",
  onSuccess,
  onError,
}: FormSubmissionOptions<T>): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Failed to submit form");
    }

    // Show success toast
    toast({
      title: successTitle,
      description: successDescription,
    });

    // Call success callback
    await onSuccess?.(data);
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : "There was a problem submitting your request. Please try again.";
    
    // Show error toast
    toast({
      title: errorTitle,
      description: errorMessage,
    });

    // Call error callback
    onError?.(error instanceof Error ? error : new Error(String(error)));
    
    return false;
  }
}

/**
 * Creates default form values with proper typing
 */
export function createDefaultFormValues<T extends Record<string, any>>(
  schema: T
): T {
  const defaults = {} as T;
  
  for (const [key, value] of Object.entries(schema)) {
    if (typeof value === 'string') {
      defaults[key as keyof T] = '' as T[keyof T];
    } else if (typeof value === 'boolean') {
      defaults[key as keyof T] = false as T[keyof T];
    } else if (typeof value === 'object' && value !== null) {
      defaults[key as keyof T] = createDefaultFormValues(value) as T[keyof T];
    } else {
      defaults[key as keyof T] = undefined as T[keyof T];
    }
  }
  
  return defaults;
}

/**
 * Handles form validation errors with toast notifications
 */
export function handleValidationErrors(errors: Record<string, any>): void {
  const errorCount = Object.keys(errors).length;
  const firstError = Object.values(errors)[0];
  
  if (errorCount === 1 && firstError?.message) {
    toast({
      title: "Validation Error",
      description: firstError.message,
    });
  } else {
    toast({
      title: "Validation Error",
      description: "Please fill in all required fields correctly.",
    });
  }
}

/**
 * Common form submission states
 */
export interface FormState {
  isSubmitting: boolean;
  hasSubmitted: boolean;
  lastSubmissionTime?: Date;
}

/**
 * Hook-like utility for managing form submission state
 */
export function createFormState(): {
  state: FormState;
  setSubmitting: (submitting: boolean) => void;
  markSubmitted: () => void;
  reset: () => void;
} {
  const state: FormState = {
    isSubmitting: false,
    hasSubmitted: false,
  };

  return {
    state,
    setSubmitting: (submitting: boolean) => {
      state.isSubmitting = submitting;
    },
    markSubmitted: () => {
      state.hasSubmitted = true;
      state.lastSubmissionTime = new Date();
    },
    reset: () => {
      state.isSubmitting = false;
      state.hasSubmitted = false;
      state.lastSubmissionTime = undefined;
    },
  };
}
