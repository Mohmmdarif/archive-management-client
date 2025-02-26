import { useLocation } from "react-router";

const useHeaderTitle = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/arsip":
      return "Arsip";
    case "/manajemen-user":
      return "Manajemen User";
    case "/kategori-surat":
      return "Kategori Surat";
    case "/jenis-surat":
      return "Jenis Surat";
    case "/kriteria-surat":
      return "Kriteria Surat";
    default:
      return "Not Found";
  }
};

export default useHeaderTitle;
