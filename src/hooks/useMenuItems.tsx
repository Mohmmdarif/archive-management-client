import { MenuProps } from "antd";
import { FiUsers } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { LuFolders } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";

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
  getListItems("Dashboard", "/dashboard", <GrHomeRounded size={15} />),
  getListItems("Arsip", "/arsip", <LuFolders size={15} />),
  getListItems("Manajemen User", "/manajemen-user", <FiUsers size={15} />),
  getListItems("Masterdata", "masterdata", <MdOutlineSettings size={15} />, [
    getListItems("Kategori Surat", "/kategori-surat"),
    getListItems("Jenis Surat", "/jenis-surat"),
    getListItems("Kriteria Surat", "/kriteria-surat"),
  ]),
];

export default items;
