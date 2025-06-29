import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

interface TypeData {
  id?: number;
  nama_jenis: string;
  keterangan: string;
}

interface TypeStore {
  typeData: TypeData[];
  isLoading: boolean;
  error: string | null;
  fetchTypeData: () => Promise<void>;
  addData: (newData: Omit<TypeData, "id">) => Promise<void>;
  updateData: (id: number, updatedData: Omit<TypeData, "id">) => Promise<void>;
  deleteData: (id: number) => Promise<void>;
}

const getToken = () => useAuthStore.getState().token;

const useTypeStore = create<TypeStore>((set) => ({
  typeData: [],
  isLoading: false,
  error: null,

  // Fetch data
  fetchTypeData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/types", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        typeData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  // Add data
  addData: async (newData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/types/create", newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        typeData: [...state.typeData, newData],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  // Update data
  updateData: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/types/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        typeData: state.typeData.map((data) =>
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
  deleteData: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/types/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        typeData: state.typeData.filter((data) => data.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

export default useTypeStore;
