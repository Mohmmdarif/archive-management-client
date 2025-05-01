import { Badge, Button, Flex, Space, Spin, Upload } from "antd";
import TableData from "../table/TableData";
import ButtonIcon from "../buttons/ButtonIcon";

import { BiEdit, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";
import { ColumnsType } from "antd/es/table";
import SubHeader from "../headers/SubHeader";
import Search from "../search/Search";
import useLetterStore from "../../../store/api/useLetterStore";
import ModalDetailLetter from "../modals/ModalDetailLetter";
import useModalStore from "../../../store/useModal";
import useNotify from "../../../hooks/useNotify";
import { useEffect } from "react";
import dayjs from "dayjs";
import { IoEyeOutline } from "react-icons/io5";

interface SuratData {
  key: React.Key;
  no_agenda?: number | null;
  tanggal_terima?: Date | null;
  jumlah_lampiran?: number | null;
  created_at: Date;
  pengarsip: string; // User who archived the letter
  no_surat: string;
  tanggal_surat: Date | null;
  id_type_surat: number;
  perihal_surat: string;
  id_kategori_surat: number;
  id_kriteria_surat: number;
  id_jenis_surat: number;
  pengirim_surat: string;
  penerima_surat: string; // penerima surat (text)
  filename: string;
  path_file: string;
}

const typeSuratMapping: { [key: number]: string } = {
  1: "Surat Masuk",
  2: "Surat Keluar",
};

const columns: ColumnsType<SuratData> = [
  {
    title: "No",
    dataIndex: "no",
    key: "no",
    width: 80,
    align: "center",
  },
  {
    title: "No Surat",
    dataIndex: "no_surat",
    key: "no_surat",
  },
  {
    title: "Perihal",
    dataIndex: "perihal_surat",
    key: "perihal_surat",
    width: 600,
    render: (text) => <span className="text-ellipsis line-clamp-1">{text}</span>,
  },
  {
    title: "Tanggal Surat",
    dataIndex: "tanggal_surat",
    key: "tanggal_surat",
    render: (tanggal) =>
      tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",
  },
  {
    title: "Pengirim",
    dataIndex: "pengirim_surat",
    key: "pengirim_surat",
  },
  {
    title: "Penerima",
    dataIndex: "penerima_surat",
    key: "penerima_surat",
  },
  {
    title: "Jenis Surat",
    dataIndex: "id_type_surat",
    key: "id_type_surat",
    render: (id) => {
      const typeSurat = typeSuratMapping[id];
      return (
        <Badge
          color={id === 1 ? "green" : "blue"}
          text={typeSurat || "-"}
        />
      );
    },
  },
  {
    title: "Pengarsip",
    dataIndex: "pengarsip",
    key: "pengarsip",
  },
  {
    title: "Tanggal Diarsipkan",
    dataIndex: "created_at",
    key: "created_at",
    render: (tanggal) =>
      tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",
  },
  {
    title: "File",
    dataIndex: "path_file",
    key: "path_file",
    align: "center",
    render: (path, record) => (
      <Button
        type="default"
        size="middle"
        onClick={() => encodeURI(`${path}${record.filename}`) && window.open(`${path}${record.filename}`, "_blank")}>
        <IoEyeOutline />
        Pratinjau
      </Button>
    ),
  },
  {
    title: "Action",
    key: "action",
    align: "center",
    render: (_, record) => (
      <Space size="small">
        <ButtonIcon
          tooltipTitle="Edit"
          icon={<BiEdit />}
          onClick={() => console.log("Edit", record)}
        />
        <ButtonIcon
          tooltipTitle="Delete"
          icon={<TbTrash />}
          onClick={() => console.log("Delete", record)}
        />
      </Space>
    ),
  },
];


export default function ArchiveContainer() {
  const { letterData, letterDetails, isLoading, addData, fetchSuratData } = useLetterStore();
  const { notify, contextHolder } = useNotify();
  const { isModalOpen, closeModal, openModal } = useModalStore();

  useEffect(() => {
    fetchSuratData();
  }, [fetchSuratData]);

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      // Panggil fungsi addData dari Zustand
      await addData({ file });

      // Notifikasi sukses
      if (onSuccess) {
        onSuccess(file);
        notify({
          type: "warning",
          notifyTitle: "Attention!",
          notifyContent: "File has been uploaded. Please check the details for saved data!.",
        });
        // Buka modal detail surat setelah berhasil upload
        openModal();
      }
    } catch (error) {
      // Notifikasi error
      if (onError) {
        onError(error);
        notify({
          type: "error",
          notifyTitle: "Gagal!",
          notifyContent: "File gagal diunggah.",
        });
      }
    }
  };


  return (
    <section className="bg-white w-full h-full p-5 rounded-lg">
      {/* Notify Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Data Surat [Masuk/Keluar]" />

      {/* Search */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: 15, marginTop: 15 }}
        gap={10}
      >
        <Search />

        <Upload
          accept=".pdf"
          customRequest={handleUpload}
          showUploadList={false}
        >
          <ButtonIcon
            type="primary"
            icon={isLoading ? <Spin size="small" /> : <BiPlus />}
            size="middle"
            shape="default"
            disabled={isLoading}
          >
            Upload Surat
          </ButtonIcon>
        </Upload>
      </Flex>

      {/* Table Data */}
      <div className="overflow-y-auto max-h-full">
        <TableData<SuratData>
          dataSource={letterDetails.map((item, index) => ({
            ...item,
            key: index,
            no: index + 1,
          }))}
          columns={columns}
        />
      </div>

      <ModalDetailLetter
        visible={isModalOpen}
        onClose={closeModal}
        data={letterData}
      />
    </section>
  )
}
