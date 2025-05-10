import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import {
  // getErrorDetails,
  getErrorMessage,
} from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

interface UserManagementData {
  id?: string;
  nip: string;
  gambar_profil: string | null;
  id_jenis_kelamin: number;
  nama_lengkap: string;
  email: string;
  role_id: number;
  jabatan: string;
  no_telp: string;
  status_aktif: boolean;
  created_at: string;
  updated_at: string;
}

interface UserManagementStore {
  userManagementData: UserManagementData[];
  userMe: UserManagementData;
  isLoading: boolean;
  error: string | null;
  fetchUserManagementData: () => Promise<void>;
  fetchUserManagementDataById: () => Promise<void>;
  addData: (newData: Omit<UserManagementData, "id">) => Promise<void>;
  updateData: (
    id: string,
    updatedData: Omit<UserManagementData, "id">
  ) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  clearError: () => void;
}

const getToken = () => useAuthStore.getState().token;

const useUserManagementStore = create<UserManagementStore>((set) => ({
  userManagementData: [],
  userMe: {} as UserManagementData,
  isLoading: false,
  error: null,

  // Fetch data user
  fetchUserManagementData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/users", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        userManagementData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  // Fetch data user by ID
  fetchUserManagementDataById: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get("/users/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        userMe: response.data.data || {},
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  // Add data
  addData: async (newData: Omit<UserManagementData, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/register", newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        userManagementData: [...state.userManagementData, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  // Update data
  updateData: async (
    id: string,
    updatedData: Omit<UserManagementData, "id">
  ) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/users/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        userManagementData: state.userManagementData.map((data) =>
          data.id === id ? { ...data, ...updatedData } : data
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  // Delete data
  deleteData: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        userManagementData: state.userManagementData.filter(
          (data) => data.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserManagementStore;
