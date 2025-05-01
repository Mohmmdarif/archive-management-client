import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";

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
      const response = await axiosInstance.get("/classifier");
      set({
        classifierData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
}));

export default useClassifierStore;
