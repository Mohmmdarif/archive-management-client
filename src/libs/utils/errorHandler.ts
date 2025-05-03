import { isAxiosError } from "axios";

export const getErrorMessage = (error: unknown): string => {
  // Check if the error is a string
  if (typeof error === "string") {
    return error;
  }

  // Handle Axios errors
  if (isAxiosError(error)) {
    const response = error.response as
      | {
          data?: {
            success?: boolean;
            message?: string;
            details?: any;
          };
          status?: number;
        }
      | undefined;

    // Jika response memiliki pesan dari API
    if (response?.data?.message) {
      return response.data.message;
    }

    // Jika tidak ada pesan dari API, gunakan pesan default berdasarkan status code
    switch (response?.status) {
      case 400:
        return "Bad request: Invalid data provided.";
      case 401:
        return "Unauthorized: Please log in to access this resource.";
      case 403:
        return "Forbidden: You don't have permission to access this resource.";
      case 404:
        return "Not found: The requested resource was not found.";
      case 500:
        return "Internal server error: Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  // Handle objects with message property
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  // Fallback for unknown error types
  return "An unexpected error occurred. Please try again.";
};
