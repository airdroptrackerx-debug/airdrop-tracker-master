/**
 * Utility to convert Firebase error codes to user-friendly messages
 */

export function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    // Authentication errors
    "auth/email-already-in-use":
      "This email is already registered. Try signing in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled. Please contact support.",
    "auth/weak-password":
      "Password is too weak. Please use at least 6 characters.",
    "auth/user-disabled":
      "This account has been disabled. Please contact support.",
    "auth/user-not-found":
      "No account found with this email. Please sign up first.",
    "auth/wrong-password":
      "Incorrect password. Please try again or reset your password.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later or reset your password.",
    "auth/network-request-failed":
      "Network error. Please check your internet connection.",
    "auth/requires-recent-login":
      "This action requires you to sign in again. Please log out and log back in.",
    "auth/popup-closed-by-user": "Sign-in cancelled. Please try again.",
    "auth/cancelled-popup-request": "Sign-in cancelled. Please try again.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using a different sign-in method. Try signing in with the original method first.",

    // Firestore errors
    "permission-denied":
      "You don't have permission to perform this action. Please sign in or contact support.",
    "not-found": "The requested resource was not found.",
    "already-exists": "This resource already exists.",
    "failed-precondition": "Unable to complete this action. Please try again.",
    aborted: "The operation was cancelled. Please try again.",
    "out-of-range": "Invalid input provided.",
    unauthenticated: "Please sign in to continue.",
    unavailable:
      "Service is temporarily unavailable. Please try again in a moment.",
    "data-loss": "Data loss or corruption detected. Please contact support.",
    "deadline-exceeded":
      "The operation took too long. Please check your connection and try again.",

    // Custom errors
    "weak-password-custom":
      "Password must be at least 6 characters with uppercase, lowercase, and numbers.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
}

export function getFirestoreErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    "permission-denied":
      "You don't have permission to access this data. Please sign in or contact support.",
    "not-found": "The requested data was not found.",
    "already-exists": "This item already exists.",
    unavailable:
      "The service is temporarily unavailable. Please try again shortly.",
    "resource-exhausted":
      "Too many requests. Please wait a moment and try again.",
    cancelled: "The operation was cancelled. Please try again.",
    "invalid-argument": "Invalid data provided. Please check your input.",
    "deadline-exceeded": "The request took too long. Please try again.",
    "data-loss": "Data error occurred. Please contact support.",
    internal:
      "An internal error occurred. Please try again or contact support.",
  };

  return (
    errorMessages[errorCode] ||
    "An error occurred while accessing data. Please try again."
  );
}

/**
 * Generic error handler that extracts a user-friendly message from any error
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    // Firebase error with code
    if ("code" in error && typeof error.code === "string") {
      // Try auth error first
      const authMessage = getAuthErrorMessage(error.code);
      if (authMessage !== "An unexpected error occurred. Please try again.") {
        return authMessage;
      }
      // Then try firestore error
      return getFirestoreErrorMessage(error.code);
    }

    // Error with message property
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return "An unexpected error occurred. Please try again.";
}
