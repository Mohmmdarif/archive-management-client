import { useLocation, useNavigate } from "react-router";
import { Menu } from "antd";

import items from "../../../hooks/useMenuItems";
import useCollapsible from "../../../store/useCollapsible";
import { useEffect, useState } from "react";
import ButtonIcon from "../buttons/ButtonIcon";

import { IoLogOutOutline } from "react-icons/io5";
import useAuthStore from "../../../store/api/useAuthStore";

export default function SidebarContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { collapsed } = useCollapsible();
  const [selectedKey, setSelectedKey] = useState<string>(location.pathname);
  const { logout } = useAuthStore();

  useEffect(() => {
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <div className="p-4 self-center">
        <img
          src="https://logodix.com/logo/2003843.jpg"
          alt="logo"
          className="w-full"
        />
      </div>
      {!collapsed && <p className="text-sm font-medium ml-5">Menu Utama</p>}

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={(e) => navigate(e.key)}
        items={items}
        style={{ fontSize: 16, marginTop: 3 }}
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
