import { create } from "zustand";

interface CollapsibleState {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const useCollapsible = create<CollapsibleState>((set) => ({
  collapsed: false,
  setCollapsed: (collapsed: boolean) => set({ collapsed }),
}));

export default useCollapsible;
