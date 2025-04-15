import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import { jwtDecode } from "jwt-decode";
import { createJSONStorage, persist } from "zustand/middleware";

interface LoginData {
  email: string;
  password: string;
}

interface AuthStore {
  token: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  isTokenExpired: () => boolean;
  clearIsLoggedIn: () => void;
}

const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set, get) => ({
      token: "",
      isLoggedIn: false,
      isLoading: false,
      error: null,

      // Login
      login: async (loginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/auth/login", loginData);
          const token = response.data.data;
          set({ token, isLoggedIn: true, isLoading: false, error: null });
          // localStorage.setItem("authToken", response.data.data);
        } catch (error) {
          const errorMessage = getErrorMessage(error);
          set({ error: errorMessage, isLoading: false });
          throw new Error(errorMessage);
        }
      },

      // Logout
      logout: () => {
        set({ token: "", isLoggedIn: false, error: null });
      },

      // Check if token is expired
      isTokenExpired: () => {
        const token = get().token;
        if (!token) return true;

        try {
          const decoded = jwtDecode<{ exp: number }>(token);
          const expirationTime = decoded.exp * 1000; // Konversi ke milidetik
          const currentTime = Date.now();

          return currentTime >= expirationTime;
        } catch (error) {
          console.error("Failed to decode token:", error);
          return true;
        }
      },

      // Check if user is authenticated
      checkAuth: () => {
        const token = get().token;
        if (token) {
          set({ token });
        } else {
          set({ token: "" });
        }
      },

      // Clear isLoggedIn
      clearIsLoggedIn: () => set({ isLoggedIn: false }),
    }),
    {
      name: "authToken",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
