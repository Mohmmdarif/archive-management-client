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
  isLoading: boolean;
  error: string | null;
  fetchUserManagementData: () => Promise<void>;
  fetchUserManagementDataById: (id: string) => Promise<UserManagementData>;
  addData: (newData: Omit<UserManagementData, "id">) => Promise<void>;
  updateData: (
    id: string,
    updatedData: Omit<UserManagementData, "id">
  ) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  clearError: () => void;
}

const { token } = useAuthStore.getState();

const useUserManagementStore = create<UserManagementStore>((set) => ({
  userManagementData: [],
  isLoading: false,
  error: null,
  errorDetails: null,

  fetchUserManagementData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/users");
      set({
        userManagementData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  fetchUserManagementDataById: async (
    id: string
  ): Promise<UserManagementData> => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get(`/users/${id}`);
      const userData = response.data.data;
      set((state) => ({
        userManagementData: state.userManagementData.map((user) =>
          user.id === id ? userData : user
        ),
        isLoading: false,
      }));
      return userData;
    } catch (error) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
      throw error;
    }
  },

  // Add data
  addData: async (newData: Omit<UserManagementData, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/auth/register", newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        userManagementData: [...state.userManagementData, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: getErrorMessage(error),
        isLoading: false,
      });
      throw error; // Lempar error untuk ditangkap di komponen
    }
  },
  updateData: async (
    id: string,
    updatedData: Omit<UserManagementData, "id">
  ) => {
    // Implementation here
  },
  deleteData: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/users/${id}`);
      set((state) => ({
        userManagementData: state.userManagementData.filter(
          (data) => data.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserManagementStore;
