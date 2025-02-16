import { MenuProps } from "antd";
import { GrHomeRounded } from "react-icons/gr";

type MenuItemType = Required<MenuProps>["items"][number];

function getListItems(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItemType[]
): MenuItemType {
  return {
    label,
    key,
    icon,
    children,
  } as MenuItemType;
}

const items: MenuItemType[] = [
  getListItems("Dashboard", "/dashboard", <GrHomeRounded />),
  getListItems("Arsip", "/arsip", <GrHomeRounded />),
  getListItems("Masterdata", "masterdata", <GrHomeRounded />, [
    getListItems("Kategori Surat", "/kategori-surat"),
    getListItems("Jenis Surat", "/jenis-surat"),
    getListItems("Kriteria", "/kriteria-surat"),
  ]),
];

export default items;
