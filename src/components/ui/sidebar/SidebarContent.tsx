import { useNavigate } from "react-router";
import { Menu } from "antd";

import items from "../../../hooks/useMenuItems";
import useCollapsible from "../../../store/useCollapsible";

export default function SidebarContent() {
  const navigate = useNavigate();
  const { collapsed } = useCollapsible();

  return (
    <>
      <div className="p-4 self-center">
        <img
          src="https://logodix.com/logo/2003843.jpg"
          alt="logo"
          className="w-full"
        />
      </div>
      {!collapsed && <p className="text-sm ml-2">Menu Utama</p>}

      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={["/dashboard"]}
        onClick={(e) => navigate(e.key)}
        items={items}
        style={{ fontSize: 16, marginTop: 5 }}
      />
    </>
  );
}
