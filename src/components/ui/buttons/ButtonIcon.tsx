import { Button, Tooltip } from "antd";

type ButtonIconProps = {
  icon: React.ReactNode;
  tooltipTitle: "Edit" | "Delete" | "Ajukan";
  onClick: () => void;
};

export default function ButtonIcon(props: ButtonIconProps) {
  const { icon, tooltipTitle, onClick } = props;
  return (
    <Tooltip title={tooltipTitle}>
      <Button onClick={onClick} shape="circle" icon={icon} />
    </Tooltip>
  );
}
