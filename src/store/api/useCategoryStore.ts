import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

interface CategoryData {
  id?: number;
  nama_kategori: string;
  keterangan: string;
}

interface CategoryStore {
  categoryData: CategoryData[];
  isLoading: boolean;
  error: string | null;
  fetchCategoryData: () => Promise<void>;
  addData: (newData: Omit<CategoryData, "id">) => Promise<void>;
  updateData: (
    id: number,
    updatedData: Omit<CategoryData, "id">
  ) => Promise<void>;
  deleteData: (id: number) => Promise<void>;
}

const getToken = () => useAuthStore.getState().token;

const useCategoryStore = create<CategoryStore>((set) => ({
  categoryData: [],
  isLoading: false,
  error: null,

  // Fetch data
  fetchCategoryData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/categories", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        categoryData: response.data.data || [],
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
      await axiosInstance.post("/categories/create", newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        categoryData: [...state.categoryData, newData],
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
      await axiosInstance.put(`/categories/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        categoryData: state.categoryData.map((data) =>
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
      await axiosInstance.delete(`/categories/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        categoryData: state.categoryData.filter((data) => data.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

export default useCategoryStore;
