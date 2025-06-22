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
  decodedToken: { exp: number; [key: string]: unknown } | null;
  isLoading: boolean;
  error: string | null;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  isTokenExpired: () => boolean;
  clearIsLoggedIn: () => void;
  getRole: () => number;
  getUserId: () => string;
}

const useAuthStore = create<AuthStore>()(
  persist<AuthStore>(
    (set, get) => ({
      token: "",
      isLoggedIn: false,
      decodedToken: null,
      isLoading: false,
      error: null,

      // Login
      login: async (loginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/auth/login", loginData);
          const token = response.data.data;

          const decodedToken = jwtDecode<{
            exp: number;
            [key: string]: unknown;
          }>(token);

          // localStorage.setItem("decoded", JSON.stringify(decodedToken));
          set({
            token,
            decodedToken: decodedToken,
            isLoggedIn: true,
            isLoading: false,
            error: null,
          });
          // localStorage.setItem("authToken", response.data.data);
        } catch (error) {
          set({ error: getErrorMessage(error), isLoading: false });
          throw new Error(getErrorMessage(error));
        }
      },

      // Logout
      logout: () => {
        localStorage.removeItem("authToken");
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
          set({ error: getErrorMessage(error), isLoading: false });
          return true;
        }
      },

      // Check if user is authenticated
      checkAuth: () => {
        const token = get().token;
        if (token && !get().isTokenExpired()) {
          set({ token });
        } else {
          set({ token: "" });
        }
      },

      // Clear isLoggedIn
      clearIsLoggedIn: () => set({ isLoggedIn: false }),

      getRole: () => {
        const decodedToken = get().decodedToken;
        return decodedToken && decodedToken.role_id !== null
          ? (decodedToken.role_id as number)
          : -1; // Default value when role_id is null
      },

      getUserId: () => {
        const decodedToken = get().decodedToken;
        return decodedToken && decodedToken.user_id !== null
          ? (decodedToken.id as string)
          : ""; // Default value when user_id is null
      },
    }),
    {
      name: "authToken",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
