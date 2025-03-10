import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";

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
      const response = await axiosInstance.get("/categories");
      set({
        categoryData: response.data.data || [],
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  // Add data
  addData: async (newData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/categories/create", newData);
      set((state) => ({
        categoryData: [...state.categoryData, newData],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  // Update data
  updateData: async (id, updatedData) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/categories/${id}`, updatedData);
      set((state) => ({
        categoryData: state.categoryData.map((data) =>
          data.id === id ? { ...data, ...updatedData } : data
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },

  // Delete data
  deleteData: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/categories/${id}`);
      set((state) => ({
        categoryData: state.categoryData.filter((data) => data.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || error.message,
        isLoading: false,
      });
    }
  },
}));

export default useCategoryStore;
