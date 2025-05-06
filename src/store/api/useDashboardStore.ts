import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";

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
}

interface DashboardStore {
  countDataSuratMasuk: number;
  countDataSuratKeluar: number;
  countDataDisposisi: number;
  letterData: LetterDetails[];
  isLoading: boolean;
  error: string | null;
  fetchCountSuratMasuk: () => Promise<void>;
  fetchCountSuratKeluar: () => Promise<void>;
  fetchCountDisposisi: (idUser: string) => Promise<void>;
  fetchLetterData: () => Promise<void>;
}

const useDashboardStore = create<DashboardStore>((set) => ({
  countDataSuratMasuk: 0,
  countDataSuratKeluar: 0,
  countDataDisposisi: 0,
  letterData: [],
  isLoading: false,
  error: null,

  // Fetch data
  fetchCountSuratMasuk: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/dashboard/suratmasuk/count");
      set({
        countDataSuratMasuk: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
  fetchCountSuratKeluar: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/dashboard/suratkeluar/count");
      set({
        countDataSuratKeluar: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
  fetchCountDisposisi: async (idUser: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get(
        `/dashboard/suratdisposisi/count/${idUser}`
      );
      set({
        countDataDisposisi: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
  fetchLetterData: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/dashboard/surat/today");
      set({
        letterData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));

export default useDashboardStore;
