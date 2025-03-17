import React, { useEffect } from "react";
import { message } from "antd";
import useAuthStore from "../../store/api/useAuthStore";
import { useNavigate } from "react-router";

const TokenChecker = () => {
  const { isTokenExpired, logout, token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      if (token && isTokenExpired()) {
        message.error("Session telah berakhir. Silakan login ulang.");
        logout();
        navigate("/login");
      }
    };

    // Cek token setiap 1 menit
    const interval = setInterval(checkToken, 60 * 1000);

    // Bersihkan interval saat komponen di-unmount
    return () => clearInterval(interval);
  }, [isTokenExpired, logout, navigate, token]);

  return null; // Komponen ini tidak merender apa pun
};

export default TokenChecker;
