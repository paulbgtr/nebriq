type AuthError = {
  message: string;
  status?: number;
};

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case "Invalid login credentials":
      return "Invalid email or password. Please check your credentials and try again.";

    case "Email not confirmed":
      return "Please check your email to confirm your account before signing in.";

    case "User already registered":
      return "This email is already registered. Please try signing in instead.";

    case "Password should be at least 6 characters":
      return "Password must be at least 6 characters long.";

    case "Rate limit exceeded":
      return "Too many attempts. Please wait a moment before trying again.";

    case "Email rate limit exceeded":
      return "Too many signup attempts. Please try again later.";

    // Network errors
    case "NetworkError":
    case "Failed to fetch":
      return "Unable to connect to the server. Please check your internet connection.";

    // Generic error with status codes
    case "Request failed":
      if (error.status === 429) {
        return "Too many requests. Please wait a moment before trying again.";
      }
      if (error.status === 500) {
        return "Server error. Please try again later.";
      }
      break;

    default:
      if (error.message.includes("duplicate key")) {
        return "This email is already registered. Please try signing in instead.";
      }
      break;
  }

  return "Something went wrong. Please try again.";
}
