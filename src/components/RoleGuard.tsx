import React, { useEffect } from "react";
import useAuthStore from "../store/api/useAuthStore";
import { Button, Result } from "antd";
import useUserManagementStore from "../store/api/useUserManagementStore";
import { useLocation } from "react-router";

interface RoleGuardProps {
  allowedRoles: number[]; // Daftar role yang diizinkan
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const { userManagementData, fetchUserManagementData } = useUserManagementStore();
  const { getRole, getUserId } = useAuthStore();
  const roleId = getRole();
  const userId = getUserId();

  const currentUser = userManagementData.find((user) => user.id === userId);
  const isDekan = currentUser?.jabatan?.toLowerCase() === "dekan";

  useEffect(() => {
    fetchUserManagementData();
  }, [fetchUserManagementData]);


  const handleNavigate = () => {
    window.location.href = "/dashboard"; // Ganti dengan URL yang sesuai
  }

  const isDisposisiPage = location.pathname.startsWith("/disposisi");

  if (!allowedRoles.includes(roleId) || (isDekan && isDisposisiPage)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Maaf, Anda tidak memiliki izin untuk mengakses halaman ini."
        extra={<Button type="primary" onClick={handleNavigate
        }>Back Home</Button>}
      />
    )
  }

  return <>{children}</>;
};

export default RoleGuard;