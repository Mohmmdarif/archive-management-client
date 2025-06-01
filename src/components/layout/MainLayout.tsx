import { Outlet } from "react-router";
import { Layout } from "antd";

import Sidebar from "../ui/sidebar/Sidebar";
import SidebarContent from "../ui/sidebar/SidebarContent";
import useHeaderTitle from "../../hooks/useHeaderTitle";
import LiveDateTime from "../ui/LiveDateTime";
import useUserManagementStore from "../../store/api/useUserManagementStore";
import { useEffect } from "react";
import { getColor, getInitial } from "../../libs/utils/randomProfile";

const { Header, Content } = Layout;

export default function MainLayout() {
  const title = useHeaderTitle();
  const { userMe, isLoading, fetchUserManagementDataById } =
    useUserManagementStore();


  useEffect(() => {
    fetchUserManagementDataById();
  }, [fetchUserManagementDataById]);

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
              <div className="p-3 rounded-lg shadow-md flex items-center justify-center text-white font-bold text-xl" style={{
                backgroundColor: getColor(getInitial(userMe?.nama_lengkap || "")),
                width: 55,
                height: 55,
              }}>
                {getInitial((userMe?.nama_lengkap || ""))}
              </div>
              <div className="hidden md:flex flex-col text-left space-y-1">
                {isLoading ? (
                  <span className="text-sm font-semibold animate-pulse">
                    Loading...
                  </span>
                ) : (
                  <>
                    <span className="text-sm font-semibold">
                      {userMe.nama_lengkap || "[Nama Lengkap]"}
                    </span>
                    <span className="text-xs">
                      {userMe.jabatan || "[Jabatan]"}
                    </span>
                  </>
                )}
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
            backgroundColor: "#F2F5FC",
          }}
        >
          <Outlet />
        </Content>
        {/* <Footer className="z-10">
          <div className="text-center text-gray-500">
            &copy; 2021. All Right Reserved. Fakultas Ilmu Komputer
          </div>
        </Footer> */}
      </Layout>
    </Layout>
  );
}
