type AuthError = {
  message: string;
  status?: number;
};

export function getAuthErrorMessage(error: AuthError): string {
  switch (error.message) {
    case "Invalid login credentials":
      return "Invalid email or password. Please check your credentials and try again.";

    case "Email not confirmed":
      return "Please check your email and click the confirmation link to complete signup.";

    case "User already registered":
      return "This email is already registered. Please try signing in instead.";

    case "Password should be at least 6 characters":
      return "Password must be at least 6 characters long.";

    case "Rate limit exceeded":
      return "Too many attempts. Please wait a moment before trying again.";

    case "Email rate limit exceeded":
      return "Too many signup attempts. Please try again later.";

    case "Email link is invalid or has expired":
      return "The confirmation link is invalid or has expired. Please try signing up again.";

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

    case "Beta access required":
      return "This is a closed beta. You need an invitation to sign up.";

    case "Beta invite already used":
      return "This beta invitation has already been used.";

    default:
      if (error.message.includes("duplicate key")) {
        return "This email is already registered. Please try signing in instead.";
      }
      break;
  }

  return "Something went wrong. Please try again.";
}
