import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

interface CriteriaData {
  id?: number;
  nama_kriteria: string;
  keterangan: string;
}

interface CriteriaStore {
  criteriaData: CriteriaData[];
  isLoading: boolean;
  error: string | null;
  fetchCriteriaData: () => Promise<void>;
  addData: (newData: Omit<CriteriaData, "id">) => Promise<void>;
  updateData: (
    id: number,
    updatedData: Omit<CriteriaData, "id">
  ) => Promise<void>;
  deleteData: (id: number) => Promise<void>;
}

const getToken = () => useAuthStore.getState().token;

const useCriteriaStore = create<CriteriaStore>((set) => ({
  criteriaData: [],
  isLoading: false,
  error: null,

  // Fetch data
  fetchCriteriaData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/criterias", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        criteriaData: response.data.data || [],
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
      await axiosInstance.post("/criterias/create", newData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        criteriaData: [...state.criteriaData, newData],
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
      await axiosInstance.put(`/criterias/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        criteriaData: state.criteriaData.map((data) =>
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
      await axiosInstance.delete(`/criterias/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        criteriaData: state.criteriaData.filter((data) => data.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

export default useCriteriaStore;
