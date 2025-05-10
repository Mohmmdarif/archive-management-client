import { create } from "zustand";
import { axiosInstance } from "../../libs/axios";
import { getErrorMessage } from "../../libs/utils/errorHandler";
import useAuthStore from "./useAuthStore";

interface pengajuPenerimaDisposisi {
  id: string;
  nip: string;
  nama_lengkap: string;
  email: string;
  role_id: number;
  jabatan: string;
  status_aktif: boolean;
  created_at: Date;
  updated_at: Date;
}

interface statusDisposisi {
  id: number;
  nama_status: string;
  created_at: Date;
  updated_at: Date;
}

interface DisposisiDetails {
  id: string;
  id_surat_masuk: string;
  id_pengaju: string;
  id_penerima: string;
  pesan_disposisi: string;
  id_status_disposisi: number;
  tanggal_disposisi: Date;
  created_at: Date;
  updated_at: Date;
  parent_disposisi_id: string | null;
  pengaju: pengajuPenerimaDisposisi;
  penerima: pengajuPenerimaDisposisi;
  status_disposisi: statusDisposisi;
}

export interface SuratDisposisi {
  id: string;
  id_surat: string;
  no_agenda: number;
  id_kategori_surat: number;
  jumlah_lampiran: number;
  id_user_disposisi: null;
  tanggal_terima: string;
  id_status_disposisi: number;
  tanggal_ajuan_disposisi: string;
  keterangan: string;
  created_at: string;
  updated_at: string;
  disposisi: DisposisiDetails[];
}

interface DisposisiStatus {
  id: number;
  nama_status: string;
  created_at: Date;
  updated_at: Date;
}

interface DisposisiCreate {
  id_surat_masuk: string;
  id_pengaju: string;
  id_penerima: string;
  pesan_disposisi: string;
  id_status_disposisi: number;
  parent_disposisi_id: string | null;
}

interface DisposisiStore {
  suratDisposisiByPenerima: SuratDisposisi[];
  disposisiData: DisposisiDetails[];
  disposisiStatus: DisposisiStatus[];
  disposisiCreate: DisposisiCreate[];
  isLoading: boolean;
  error: string | null;
  fetchDisposisiById: (id: string) => Promise<void>;
  fetchDisposisiBySuratMasukId: (id: string) => Promise<void>;
  fetchDisposisiByUserPenerima: (id: string) => Promise<void>;
  fetchDisposisiStatus: () => Promise<void>;
  createDisposisi: (data: DisposisiCreate) => Promise<void>;
}

const getToken = () => useAuthStore.getState().token;

const useDisposisiStore = create<DisposisiStore>((set) => ({
  suratDisposisiByPenerima: [],
  disposisiData: [],
  disposisiStatus: [],
  disposisiCreate: [],
  isLoading: false,
  error: null,

  fetchDisposisiById: async (id: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get(`/disposisi/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        disposisiData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  fetchDisposisiBySuratMasukId: async (id: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get(`/disposisi/surat/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        disposisiData: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  fetchDisposisiByUserPenerima: async (id: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get(
        `/disposisi/surat/penerima/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      set({
        suratDisposisiByPenerima: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  fetchDisposisiStatus: async () => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.get("/disposisi/status", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        disposisiStatus: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },

  createDisposisi: async (data: DisposisiCreate) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const response = await axiosInstance.post("/disposisi/create", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      set({
        disposisiCreate: response.data.data || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: getErrorMessage(error), isLoading: false });
      throw new Error(getErrorMessage(error));
    }
  },
}));
export default useDisposisiStore;
