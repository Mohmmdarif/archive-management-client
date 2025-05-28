import { useLocation, useNavigate } from "react-router";
import { Menu } from "antd";

import items from "../../../hooks/useMenuItems";
import useCollapsible from "../../../store/useCollapsible";
import { useEffect, useState } from "react";
import ButtonIcon from "../buttons/ButtonIcon";

import { IoLogOutOutline } from "react-icons/io5";
import useAuthStore from "../../../store/api/useAuthStore";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import logo from "../../../assets/logo.webp";
import useUserManagementStore from "../../../store/api/useUserManagementStore";

export default function SidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed } = useCollapsible();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const { logout, getRole, getUserId } = useAuthStore();
  const roleId = getRole();
  const userId = getUserId();
  const { userManagementData, fetchUserManagementData } = useUserManagementStore();

  const currentUser = userManagementData.find((user) => user.id === userId);
  const isDekan = currentUser?.jabatan.toLowerCase() === "dekan";

  useEffect(() => {
    fetchUserManagementData();
  }, [fetchUserManagementData]);

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  const filteredItems = items
    .filter((item) => {
      // Sembunyikan menu Masterdata jika roleId adalah 5
      if ([2, 5].includes(roleId) && item.label === "Masterdata") {
        return false;
      }

      // Sembunyikan menu Disposisi jika jabatan adalah Dekan
      if (isDekan && item.label === "Disposisi") {
        return false;
      }

      // Filter berdasarkan allowedRoles
      if (item?.allowedRoles) {
        return item.allowedRoles.includes(roleId);
      }
      return true;
    })
    .map((item) => ({
      ...item,
      children: item.children
        ? item.children.filter((child) =>
          child.allowedRoles ? child.allowedRoles.includes(roleId) : true
        )
        : undefined,
    }));

  return (
    <>
      <div className="p-2 self-center mb-4">
        <img
          src={logo}
          alt="logo"
          className="w-full"
        />
      </div>
      {!collapsed && <p className="text-sm font-medium ml-4">Menu Utama</p>}

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => navigate(e.key)}
        items={filteredItems as ItemType<MenuItemType>[]}
        style={{ fontSize: 16 }}
      />

      {!collapsed && (
        <div className="bottom-0 absolute w-full flex py-4">
          <ButtonIcon
            icon={<IoLogOutOutline size={15} />}
            onClick={() => logout()}
            type="text"
            style={{
              color: "red",
              fontWeight: 500,
              marginLeft: "15px",
            }}
          >
            Logout
          </ButtonIcon>
        </div>
      )}
    </>
  );
}
