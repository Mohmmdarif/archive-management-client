import { Outlet } from "react-router";
import { Layout } from "antd";

import Sidebar from "../ui/sidebar/Sidebar";
import SidebarContent from "../ui/sidebar/SidebarContent";
import useHeaderTitle from "../../hooks/useHeaderTitle";
import LiveDateTime from "../ui/LiveDateTime";
import { BiUser } from "react-icons/bi";

const { Header, Footer, Content } = Layout;

export default function MainLayout() {
  const title = useHeaderTitle();
  return (
    <Layout className="h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar>
        {/* Sidebar Content */}
        <Layout style={{ backgroundColor: "white" }}>
          <SidebarContent />
        </Layout>
      </Sidebar>
      <Layout>
        {/* Header */}
        <Header
          style={{ backgroundColor: "#F2F5FC", color: "black", height: 110 }}
        >
          <section className="flex justify-between items-center h-full pt-3">
            <div className="flex flex-col space-y-2">
              <span className="text-xl md:text-3xl font-bold">{title}</span>
              <LiveDateTime />
            </div>
            <button className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2 rounded-lg">
              <div className="bg-white p-3 rounded-lg shadow-md">
                <BiUser size={30} color="#C1C7CD" />
              </div>
              <div className="hidden md:flex flex-col text-left space-y-1">
                <span className="text-base font-semibold">M Arif Fadhilah</span>
                <span className="text-sm">Arsiparis</span>
              </div>
            </button>
          </section>
        </Header>

        {/* Content */}
        <Content
          style={{
            padding: "24px 16px 0",
            overflow: "initial",
            backgroundColor: "#F2F5FC",
          }}
        >
          <Outlet />
        </Content>
        <Footer>
          <div className="text-center text-gray-500">
            &copy; 2021. All Right Reserved. Fakultas Ilmu Komputer
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
}
