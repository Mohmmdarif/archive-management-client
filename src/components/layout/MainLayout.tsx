import { Outlet } from "react-router";
import { Layout } from "antd";

import Sidebar from "../ui/sidebar/Sidebar";
import SidebarContent from "../ui/sidebar/SidebarContent";
import useHeaderTitle from "../../hooks/useHeaderTitle";
import LiveDateTime from "../ui/LiveDateTime";
import { getColor, getInitial } from "../../libs/utils/randomProfile";
import useAuthStore from "../../store/api/useAuthStore";
import { getJabatan } from "../../libs/utils/getRole";

const { Header, Content } = Layout;

export default function MainLayout() {
  const title = useHeaderTitle();
  const personalData = useAuthStore((state) => state.decodedToken);

  const userMe = {
    nama_lengkap: (personalData?.nama_lengkap as string) || "",
    jabatan: (personalData?.jabatan as string) || "",
  };

  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sidebar>
        {/* Sidebar Content */}
        <Layout style={{ backgroundColor: "white" }}>
          <SidebarContent />
        </Layout>
      </Sidebar>
      <Layout className="flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <Header
          style={{ backgroundColor: "#F2F5FC", color: "black", height: 110 }}
        >
          <section className="flex justify-between items-center h-full pt-3">
            <div className="flex flex-col space-y-2">
              <span className="text-xl md:text-3xl font-bold">{title}</span>
              <LiveDateTime />
            </div>
            <button className="flex items-center gap-2 cursor-pointer p-2 rounded-lg">
              <div
                className="p-3 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl"
                style={{
                  backgroundColor: getColor(getInitial(userMe?.nama_lengkap)),
                  width: 55,
                  height: 55,
                }}
              >
                {getInitial(userMe?.nama_lengkap || "")}
              </div>
              <div className="hidden md:flex flex-col text-left space-y-1">
                <span className="text-sm font-semibold">
                  {userMe.nama_lengkap || "[Nama Lengkap]"}
                </span>
                <span className="text-xs">{getJabatan(userMe.jabatan) || "[Jabatan]"}</span>
              </div>
            </button>
          </section>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: "10px",
            overflowY: "auto",
            flex: 1,
            overflow: "initial",
            minHeight: "80vh",
            backgroundColor: "#F2F5FC",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
