import { useLocation } from "react-router";

const useHeaderTitle = () => {
  const location = useLocation();

  if (location.pathname.startsWith("/arsip/disposisi/")) {
    return "Disposisi Detail";
  }

  switch (location.pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/arsip":
      return "Arsip";
    case "/disposisi":
      return "Disposisi";
    case "/manajemen-user":
      return "Manajemen User";
    case "/kategori-surat":
      return "Master Data";
    case "/jenis-surat":
      return "Master Data";
    case "/kriteria-surat":
      return "Master Data";
    default:
      return "Not Found";
  }
};

export default useHeaderTitle;
