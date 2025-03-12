import { Badge, Flex, Space, Tag } from "antd";

import TableData from "../table/TableData";
import ButtonIcon from "../buttons/ButtonIcon";

import { BiEdit, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";
import { ColumnsType } from "antd/es/table";
import SubHeader from "../headers/SubHeader";
import Search from "../search/Search";

interface UserData {
  key: React.Key;
  no: number;
  nip: string;
  namaLengkap: string;
  notelp: string;
  jabatan: string;
  role: string;
  status: string;
}

const dataSource: UserData[] = [
  {
    key: "1",
    no: 1,
    nip: "123456789",
    namaLengkap: "John Doe",
    notelp: "08123456789",
    jabatan: "Kepala Sekolah",
    role: "Admin",
    status: "Aktif",
  },
];

const columns: ColumnsType<UserData> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    align: "center",
  },
  {
    title: "NIP",
    dataIndex: "nip",
    key: "nip",
  },
  {
    title: "Nama Lengkap",
    dataIndex: "namaLengkap",
    key: "namaLengkap",
  },
  {
    title: "No. Telp",
    dataIndex: "notelp",
    key: "notelp",
  },
  {
    title: "Jabatan",
    dataIndex: "jabatan",
    key: "jabatan",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    align: "center",
    render: () => {
      return (
        <Tag
          color="blue"
          style={{ padding: "5px 20px", borderRadius: 20, fontSize: 14 }}
        >
          Admin
        </Tag>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    align: "center",
    render: () => {
      return <Badge status="success" text="Aktif" />;
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    align: "center",
    render: () => {
      return (
        <Space size="small">
          <ButtonIcon
            tooltipTitle="Edit"
            icon={<BiEdit />}
            shape="circle"
            size="middle"
            onClick={() => console.log("Edit")}
          />
          <ButtonIcon
            tooltipTitle="Delete"
            icon={<TbTrash />}
            shape="circle"
            size="middle"
            onClick={() => console.log("Delete")}
          />
        </Space>
      );
    },
  },
];

export default function UserManagementContainer() {
  return (
    <section className="bg-white w-full h-full p-5 rounded-lg overflow-x-auto">
      {/* Sub Header */}
      <SubHeader subHeaderTitle="Data Pengguna" />

      {/* Search and Button Add */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: 20, marginTop: 20 }}
        gap={10}
      >
        <Search />

        <ButtonIcon
          type="primary"
          icon={<BiPlus />}
          onClick={() => console.log("Tambah")}
          size="middle"
          shape="default"
        >
          Tambah
        </ButtonIcon>
      </Flex>

      <TableData dataSource={dataSource} columns={columns} />
    </section>
  );
}
