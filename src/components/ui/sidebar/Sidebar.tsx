import { Layout } from "antd";
import CollapsibleButton from "../CollapsibleButton";
import useCollapsible from "../../../store/useCollapsible";

const { Sider } = Layout;

type SidebarProps = {
  children: React.ReactNode;
};

export default function Sidebar({ children }: SidebarProps) {
  const { setCollapsed } = useCollapsible();

  return (
    <Sider
      style={{ backgroundColor: "white", color: "black" }}
      breakpoint="lg"
      collapsedWidth="0"
      width={256}
      onCollapse={(value) => setCollapsed(value)}
      trigger={<CollapsibleButton />}
    >
      {children}
    </Sider>
  );
}
