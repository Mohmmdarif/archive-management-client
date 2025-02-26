import { Badge, Button, Flex, Input, Space, Table } from "antd";
import SubHeader from "../headers/SubHeader";
import { useState } from "react";
import DefaultModal from "../modals/DefaultModal";
import { BiEdit, BiPlus, BiSearch } from "react-icons/bi";
import ButtonIcon from "../buttons/ButtonIcon";
import { TbTrash } from "react-icons/tb";
import InputField from "../inputs/InputField";

const dataSource = [
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

const columns = [
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <section className="bg-white w-full h-full p-5 rounded-lg overflow-x-auto">
      {/* Sub Header */}
      <SubHeader subHeaderTitle="Data Surat Masuk/Keluar" />

      {/* Search and Button Add */}
      <Flex justify="space-between" align="center" style={{ marginBottom: 20 }}>
        <Input
          size="middle"
          placeholder="Search..."
          prefix={<BiSearch size={18} color="gray" />}
          style={{ width: 300 }}
        />
        <Button type="primary" icon={<BiPlus />} size="middle">
          Tambah
        </Button>
      </Flex>
      {/* Table Data */}
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
        onRow={(record) => {
          return {
            onClick: () => {
              setIsModalOpen(true);
            },
            style: { cursor: "pointer" },
          };
        }}
      />

      {/* Modal Detail */}
      {isModalOpen && (
        <DefaultModal
          isOpen={isModalOpen}
          handleOk={() => setIsModalOpen(false)}
          handleCancel={() => setIsModalOpen(false)}
        />
      )}
    </section>
  );
}
