import { Button, Tooltip } from "antd";

type ButtonIconProps = {
  icon: React.ReactNode;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  size?: "small" | "middle" | "large";
  shape?: "default" | "circle" | "round";
  style?: React.CSSProperties;
  tooltipTitle?: "Edit" | "Delete" | "Ajukan";
  children?: React.ReactNode;
  onClick: (() => void) | ((e: React.MouseEvent<HTMLElement>) => void);
};

export default function ButtonIcon(props: ButtonIconProps) {
  const { icon, type, size, shape, style, tooltipTitle, children, onClick } =
    props;
  return (
    <Tooltip title={tooltipTitle}>
      <Button
        onClick={onClick}
        type={type}
        shape={shape}
        size={size}
        icon={icon}
        style={{
          ...style,
        }}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
