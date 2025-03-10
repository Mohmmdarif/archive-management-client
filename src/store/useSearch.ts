import { create } from "zustand";

interface SearchStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const useSearchStore = create<SearchStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

export default useSearchStore;
