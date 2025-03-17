// // libs/utils/errorHandler.ts

import { isAxiosError } from "axios";

// interface AxiosErrorResponse {
//   status?: number;
//   data?: {
//     message?: string;
//     error?: string;
//     errors?: Record<string, string[]> | string[];
//   };
// }

// interface ErrorDetails {
//   message: string;
//   status?: number;
//   code?: string;
//   timestamp?: string;
//   url?: string;
//   method?: string;
//   validationErrors?: Record<string, string[]>;
// }

// export const getErrorMessage = (error: any): string => {
//   // console.log("Error:", error);
//   // Handle Error instances

//   let message = "";
//   // Add status-specific messages
//   switch (error.status) {
//     case 400:
//       message = "Bad request";
//       break;
//     case 401:
//       message = "Unauthorized access";
//       break;
//     case 403:
//       message = "Forbidden: You don't have permission";
//       break;
//     case 404:
//       message = "Requested resource not found";
//       break;
//     case 500:
//       message = "Internal server error";
//       break;
//   }

//   // // Handle validation errors
//   // if (status === 400 && data.errors) {
//   //   if (Array.isArray(data.errors)) {
//   //     return data.errors.join(", ");
//   //   }
//   //   return Object.values(data.errors).flat().join(", ");
//   // }

//   return message || "Something went wrong";
// };

// // // Handle string errors
// // if (typeof error === "string") {
// //   return error;
// // }

// // Handle Axios errors
// // if (Axios(error)) {
// //   console.log("masuk");
// //   const response = error.response as AxiosErrorResponse | undefined;
// //   const request = error.request;
// //   const status = response?.status;
// //   const data = response?.data;

// //   // Network errors (no response)
// //   if (!response && request) {
// //     return "Network error: Please check your internet connection";
// //   }

// //   // Server response errors
// //   if (response && data) {
// //     // Default server message
// //     let message = data.message || data.error || error.message;

// //     // Add status-specific messages
// //     switch (status) {
// //       case 400:
// //         message = "Bad request";
// //         break;
// //       case 401:
// //         message = "Unauthorized access";
// //         break;
// //       case 403:
// //         message = "Forbidden: You don't have permission";
// //         break;
// //       case 404:
// //         message = "Requested resource not found";
// //         break;
// //       case 500:
// //         message = "Internal server error";
// //         break;
// //     }

// //     // Handle validation errors
// //     if (status === 400 && data.errors) {
// //       if (Array.isArray(data.errors)) {
// //         return data.errors.join(", ");
// //       }
// //       return Object.values(data.errors).flat().join(", ");
// //     }

// //     return message || "Something went wrong";
// //   }
// // }

// // // Handle objects with message property
// // if (typeof error === "object" && error !== null && "message" in error) {
// //   return String((error as { message: unknown }).message);
// // }

// // // Fallback for unknown error types
// // try {
// //   return JSON.stringify(error);
// // } catch {
// //   return "Unknown error occurred";
// // }
// // };

// export const getErrorDetails = (error: unknown): ErrorDetails => {
//   const details: ErrorDetails = {
//     message: getErrorMessage(error),
//     timestamp: new Date().toISOString(),
//   };

//   if (isAxiosError(error)) {
//     const response = error.response as AxiosErrorResponse | undefined;

//     details.status = response?.status;
//     details.code = error.code;
//     details.url = error.config?.url;
//     details.method = error.config?.method?.toUpperCase();

//     if (response?.data?.errors) {
//       details.validationErrors = Array.isArray(response.data.errors)
//         ? { general: response.data.errors }
//         : response.data.errors;
//     }
//   }

//   return details;
// };

// // Type guard untuk Axios error
// const isAxiosError = (error: unknown): error is import("axios").AxiosError => {
//   return (
//     typeof error === "object" &&
//     error !== null &&
//     "isAxiosError" in error &&
//     (error as any).isAxiosError
//   );
// };

// libs/utils/errorHandler.ts

export const getErrorMessage = (error: unknown): string => {
  // Handle Error instances
  // if (error instanceof Error) {
  //   return error.message;
  // }

  // Handle string errors
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
