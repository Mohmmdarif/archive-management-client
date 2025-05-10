import { MenuProps } from "antd";
import { MenuDividerType } from "antd/es/menu/interface";
import { FiUsers } from "react-icons/fi";
import { GrHomeRounded } from "react-icons/gr";
import { LuFolders } from "react-icons/lu";
import { MdOutlineSettings } from "react-icons/md";
import { TbFolderSymlink } from "react-icons/tb";

// Exclude null dari tipe bawaan
type BaseMenuItemType = Omit<Exclude<NonNullable<MenuProps["items"]>[number], null | MenuDividerType>, "children"> & {
  children?: BaseMenuItemType[];
};

interface CustomMenuItemType extends BaseMenuItemType {
  allowedRoles?: number[]; // Tambahkan properti allowedRoles
  children?: CustomMenuItemType[]; // Pastikan children kompatibel
}

function getListItems(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  allowedRoles?: number[],
  children?: CustomMenuItemType[]
): CustomMenuItemType {
  return {
    label,
    key,
    icon,
    allowedRoles,
    children,
  } as CustomMenuItemType;
}

const items: CustomMenuItemType[] = [
  getListItems("Dashboard", "/dashboard", <GrHomeRounded size={15} />, [1, 2, 3, 4, 5]),
  getListItems("Arsip", "/arsip", <LuFolders size={15} />, [1, 2, 3, 4, 5]),
  getListItems("Disposisi", "/disposisi", <TbFolderSymlink size={15} />, [1, 3, 5]),
  getListItems("Manajemen User", "/manajemen-user", <FiUsers size={15} />, [1]),
  getListItems("Masterdata", "masterdata", <MdOutlineSettings size={15} />, undefined, [
    getListItems("Kategori Surat", "/kategori-surat", undefined, [1, 2, 3, 4]),
    getListItems("Jenis Surat", "/jenis-surat", undefined, [1, 2, 3, 4]),
    getListItems("Kriteria Surat", "/kriteria-surat", undefined, [1, 2, 3, 4]),
  ]),
];

export default items;
