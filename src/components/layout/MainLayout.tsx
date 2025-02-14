import { Layout, Menu } from "antd";
import { Outlet } from "react-router";

const { Header, Footer, Sider, Content } = Layout;

export default function MainLayout() {
  return (
    <Layout className="h-screen">
      <Sider
        style={{ backgroundColor: "white", color: "black" }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Menu
          theme="light"
          mode="inline"
          items={[
            {
              key: "1",
              label: "Menu 1",
            },
            {
              key: "2",
              label: "Menu 2",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ backgroundColor: "white", color: "black" }}>
          Header
        </Header>
        <Content
          style={{
            padding: "24px 16px 0",
            overflow: "initial",
            backgroundColor: "#F2F5FC",
          }}
        >
          <Outlet />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
}
