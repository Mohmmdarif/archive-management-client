import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import { jwtDecode } from "jwt-decode";

interface LoginData {
  email: string;
  password: string;
}

interface AuthStore {
  token: string;
  isLoading: boolean;
  error: string | null;
  errorDetails: any;
  login: (loginData: LoginData) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  isTokenExpired: () => boolean;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: localStorage.getItem("authToken") || "",
  isLoading: false,
  error: null,
  errorDetails: null,

  login: async (loginData) => {
    set({ isLoading: true, error: null, errorDetails: null });
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      set({ token: response.data.token, isLoading: false });
      localStorage.setItem("authToken", response.data.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      set({ error: errorMessage, isLoading: false });
      throw new Error(errorMessage);
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    set({ token: "", error: null, errorDetails: null });
  },
  isTokenExpired: () => {
    const token = localStorage.getItem("authToken");
    if (!token) return true;

    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const expirationTime = decoded.exp * 1000; // Konversi ke milidetik
      const currentTime = Date.now();
      const oneHourInMs = 60 * 60 * 1000; // 1 jam dalam milidetik

      // Cek apakah token akan kadaluarsa dalam 1 jam
      return expirationTime - currentTime <= oneHourInMs;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return true;
    }
  },
  checkAuth: () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      set({ token });
    }
  },
}));

export default useAuthStore;
