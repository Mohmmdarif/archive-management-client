import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";

type Classification = {
  Classify: string;
  Criteria: string;
}[];

type EntitiesNER = {
  text: string;
  label: string;
}[];

interface LetterData {
  filePath: string;
  file: File | null;
  classification: Classification;
  entities: EntitiesNER;
  text: string;
}

interface LetterDetails {
  no_agenda?: number | null;
  tanggal_terima?: Date | null;
  jumlah_lampiran?: number | null;
  created_at: Date;
  pengarsip: string; // User who archived the letter
  no_surat: string;
  tanggal_surat: Date | null;
  id_type_surat: number;
  perihal_surat: string;
  id_kategori_surat: number;
  id_kriteria_surat: number;
  id_jenis_surat: number;
  pengirim_surat: string;
  penerima_surat: string; // penerima surat (text)
  filename: string;
  path_file: string;
}

interface LetterStore {
  letterData: LetterData[];
  letterDetails: LetterDetails[];
  isLoading: boolean;
  error: string | null;

  fetchSuratData: () => Promise<void>;
  // Add data with file upload
  addData: (newData: { [key: string]: File; file: File }) => Promise<void>;
  savedConfirmedData: (payload: LetterDetails) => Promise<void>;
}

const useLetterStore = create<LetterStore>((set) => ({
  letterData: [],
  letterDetails: [],
  isLoading: false,
  error: null,

  fetchSuratData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/surat/letters");
      const { data } = response.data;
      console.log("Data surat:", data);
      set({ letterDetails: data || [], isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
  // Add data with file upload
  addData: async (newData: { [key: string]: File; file: File }) => {
    set({ isLoading: true, error: null });
    try {
      // Create FormData object
      const formData = new FormData();

      Object.keys(newData).forEach((key) => {
        formData.append(key, newData[key]);
      });

      // Send POST request with FormData
      const response = await axiosInstance.post("/surat/single", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { classification, entities, text } = response.data.data;
      const { filePath } = response.data.data; // Extract filePath from response data
      set((state) => ({
        letterData: [
          ...state.letterData,
          {
            file: newData.file,
            filePath,
            classification,
            entities,
            text,
          },
        ],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },

  savedConfirmedData: async (payload: LetterDetails) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post("/surat/save", {
        data: payload,
      });
      set((state) => ({
        letterDetails: state.letterDetails,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
    }
  },
}));

export default useLetterStore;
