import { Badge, Flex, Space } from "antd";

import TableData from "../table/TableData";
import ButtonIcon from "../buttons/ButtonIcon";

import { BiEdit, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";
import { ColumnsType } from "antd/es/table";
import SubHeader from "../headers/SubHeader";
import Search from "../search/Search";

interface SuratData {
  key: React.Key;
  no: number;
  noSurat: string;
  tanggalSurat: string;
  pengirim: string;
  perihal: string;
  tipeSurat: string;
  status: string;
}

const dataSource: SuratData[] = [
  {
    key: "1",
    no: 1,
    noSurat: "001/UN7.7/PP/2021",
    tanggalSurat: "2021-08-03",
    pengirim: "Dekan FIK",
    perihal: "Pengajuan Proposal PKM",
    tipeSurat: "Surat Masuk",
    status: "Diterima",
  },
];

const columns: ColumnsType<SuratData> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
  },
  {
    title: "No Surat",
    dataIndex: "noSurat",
    key: "noSurat",
  },
  {
    title: "Tanggal Surat",
    dataIndex: "tanggalSurat",
    key: "tanggalSurat",
  },
  {
    title: "Pengirim",
    dataIndex: "pengirim",
    key: "pengirim",
  },
  {
    title: "Perihal",
    dataIndex: "perihal",
    key: "perihal",
  },
  {
    title: "Tipe Surat",
    dataIndex: "tipeSurat",
    key: "tipeSurat",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: () => {
      return <Badge status="success" text="Diterima" />;
    },
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    render: () => {
      return (
        <Space size="small">
          <ButtonIcon
            tooltipTitle="Edit"
            icon={<BiEdit />}
            onClick={() => console.log("Edit")}
          />
          <ButtonIcon
            tooltipTitle="Delete"
            icon={<TbTrash />}
            onClick={() => console.log("Delete")}
          />
        </Space>
      );
    },
  },
];

export default function ArchiveContainer() {
  return (
    <section className="bg-white w-full h-full p-5 rounded-lg overflow-x-auto">

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Data Surat [Masuk/Keluar]" />

      {/* Search */}
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
          onClick={() => console.log("Add")}
          size="middle"
          shape="default"
        >
          Upload Surat
        </ButtonIcon>
      </Flex>

      {/* Table Data */}
      <div className="mt-5">
        <TableData dataSource={dataSource} columns={columns} />
      </div>
    </section>
  )
}
