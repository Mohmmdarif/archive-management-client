import { Button, Tooltip } from "antd";

type ButtonIconProps = {
  icon: React.ReactNode;
  type?: "primary" | "default" | "dashed" | "link" | "text";
  size?: "small" | "middle" | "large";
  shape?: "default" | "circle" | "round";
  style?: React.CSSProperties;
  tooltipTitle?: "Edit" | "Delete" | "Ajukan" | "Pratinjau";
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: (() => void) | ((e: React.MouseEvent<HTMLElement>) => void);
};

export default function ButtonIcon(props: ButtonIconProps) {
  const { icon, type, size, shape, style, tooltipTitle, children, disabled, onClick } =
    props;
  return (
    <Tooltip title={tooltipTitle}>
      <Button
        onClick={onClick}
        type={type}
        shape={shape}
        size={size}
        icon={icon}
        disabled={disabled}
        style={{
          ...style,
        }}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
