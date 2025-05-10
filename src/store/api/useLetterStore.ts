import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

type Classification = {
  Classify: string;
  Criteria: string;
}[];

type EntitiesNER = {
  text: string;
  label: string;
}[];

interface LetterData {
  cloudinaryUrl: string;
  publicId: string;
  data: {
    classification: Classification;
    entities: EntitiesNER;
    text: string;
  };
}

interface SuratMasuk {
  id: string;
  no_agenda: number;
  id_kategori_surat: number;
  jumlah_lampiran: number;
  id_user_disposisi: string | null;
  tanggal_terima: Date;
  id_status_disposisi: number;
  tanggal_ajuan_disposisi: Date;
  keterangan: string;
}

interface SuratKeluar {
  id: string;
  tanggal_kirim: Date;
}

interface LetterDetails {
  id: string;
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
  Surat_Masuk?: SuratMasuk[];
  surat_keluar?: SuratKeluar[];
}

interface LetterStore {
  letterData: LetterData[];
  letterDetails: LetterDetails;
  isLoading: boolean;
  error: string | null;

  fetchSuratData: () => Promise<void>;
  fetchSuratById: (id: string) => Promise<void>;
  // Add data with file upload
  addData: (newData: { [key: string]: File; file: File }) => Promise<void>;
  savedConfirmedData: (payload: LetterDetails) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  updateData: (
    id: string,
    updatedData: Partial<LetterDetails>
  ) => Promise<void>;
}

const getToken = () => useAuthStore.getState().token;

const useLetterStore = create<LetterStore>((set) => ({
  letterData: [],
  letterDetails: {} as LetterDetails,
  isLoading: false,
  error: null,

  fetchSuratData: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/surat/letters", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const { data } = response.data;
      set({ letterDetails: data || {}, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  fetchSuratById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/surat/letters/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      const { data } = response.data;
      set({ letterDetails: data || {}, isLoading: false });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
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
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const { cloudinaryUrl, publicId, data } = response.data.data;
      const { classification, entities, text } = data;
      set(() => ({
        letterData: [
          {
            cloudinaryUrl,
            publicId,
            data: {
              classification,
              entities,
              text,
            },
          },
        ],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  savedConfirmedData: async (payload: LetterDetails) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.post(
        "/surat/save",
        {
          data: payload,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      set((state) => ({
        letterDetails: state.letterDetails,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  deleteData: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/surat/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        letterDetails:
          state.letterDetails.id === id
            ? ({} as LetterDetails)
            : state.letterDetails,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  updateData: async (id: string, updatedData: Partial<LetterDetails>) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/surat/${id}`, updatedData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set((state) => ({
        letterDetails:
          state.letterDetails.id === id
            ? { ...state.letterDetails, ...updatedData }
            : state.letterDetails,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

export default useLetterStore;
