import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

interface ClassifierData {
  id?: number;
  nama_type: string;
}

interface ClassifierStore {
  classifierData: ClassifierData[];
  isLoading: boolean;
  error: string | null;
  fetchClassifierData: () => Promise<void>;
}

const getToken = () => useAuthStore.getState().token;

const useClassifierStore = create<ClassifierStore>((set) => ({
  classifierData: [],
  isLoading: false,
  error: null,

  // Fetch data
  fetchClassifierData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/classifier", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        classifierData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

export default useClassifierStore;
