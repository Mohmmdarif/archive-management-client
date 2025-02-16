import { useLocation } from "react-router";

const useHeaderTitle = () => {
  const location = useLocation();

  switch (location.pathname) {
    case "/dashboard":
      return "Dashboard";
    case "/arsip":
      return "Arsip";
    default:
      return "Not Found";
  }
};

export default useHeaderTitle;
