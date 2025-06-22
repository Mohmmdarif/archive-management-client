import React from "react";
import useAuthStore from "../store/api/useAuthStore";
import { Button, Result } from "antd";

interface RoleGuardProps {
  allowedRoles: number[]; // Daftar role yang diizinkan
  children: React.ReactNode;
}

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { getRole } = useAuthStore();
  const roleId = getRole();

  const handleNavigate = () => {
    window.location.href = "/dashboard"; // Ganti dengan URL yang sesuai
  };

  if (!allowedRoles.includes(roleId)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={
          <Button type="primary" onClick={handleNavigate}>
            Back Home
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

export default RoleGuard;
