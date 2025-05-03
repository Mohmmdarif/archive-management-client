import { Badge, Button, Flex, Modal, Space, Spin, Upload } from "antd";
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
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { IoEyeOutline } from "react-icons/io5";
import useClassifierStore from "../../../store/api/useClassifierStore";
import ModalEditDetailLetter from "../modals/ModalEditDetailLetter";

interface SuratMasuk {
  id: string;
  no_agenda: number;
  id_kategori_surat: number;
  jumlah_lampiran: number;
  id_user_disposisi: string | null;
  tanggal_terima: Date;
  id_status_disposisi: number;
  tanggal_ajuan_disposisi: Date;
  keterangan: string;
}

interface SuratKeluar {
  id: string;
  tanggal_kirim: Date;
}

interface LetterDetails {
  id: string;
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
  Surat_Masuk?: SuratMasuk[];
  surat_keluar?: SuratKeluar[];
}


export default function ArchiveContainer() {
  const { letterData, letterDetails, isLoading, addData, fetchSuratData, deleteData } = useLetterStore();
  const { notify, contextHolder } = useNotify();
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const { classifierData } = useClassifierStore();
  const [selectedRecord, setSelectedRecord] = useState<LetterDetails | null>(null);
  const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);

  const columns: ColumnsType<LetterDetails> = [
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
      width: 200,
      render: (text) => <span className="text-ellipsis line-clamp-1">{text}</span>,
    },
    {
      title: "Jenis Surat",
      dataIndex: "id_type_surat",
      key: "id_type_surat",
      render: (id) => {
        const type = classifierData.find((item) => item.id === id);
        return (
          <Badge
            color={type?.id === 1 ? "blue" : "green"}
            text={type?.nama_type}
            style={{ textTransform: "capitalize" }}
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
        console.log(path, record),
        <Button
          type="default"
          size="middle"
          onClick={(e) => handlePreview(path, e)}>
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
            shape="circle"
            icon={<BiEdit />}
            onClick={(e) => record && handleEdit(record, e)}
          />
          <ButtonIcon
            tooltipTitle="Delete"
            shape="circle"
            icon={<TbTrash />}
            onClick={(e) => record.id && handleDelete(record.id, e)}
          />
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchSuratData();
  }, [fetchSuratData]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    Modal.confirm({
      title: "Hapus Data Surat",
      content: "Apakah anda yakin ingin menghapus data surat ini?",
      okText: "Hapus",
      cancelText: "Batal",
      onOk: async () => {
        try {
          await deleteData(id);
          await fetchSuratData();
          // Show notification
          notify({
            type: "success",
            notifyTitle: "Berhasil!",
            notifyContent: "Data surat berhasil dihapus.",
          });
        } catch (error) {
          notify({
            type: "error",
            notifyTitle: "Error!",
            notifyContent: (error as Error).message,
          });
        }
      },
    });
  };

  const handleEdit = (record: LetterDetails, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRecord(record)
    setIsModalEditOpen(true);
  };

  const handlePreview = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(path, "_blank");
  }

  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;

    try {
      await addData({ file });

      // Notifikasi sukses
      if (onSuccess) {
        onSuccess(file);
        notify({
          type: "warning",
          notifyTitle: "Perhatian!",
          notifyContent: "File berhasil diklasifikasikan, Harap periksa detail surat sebelum menyimpan data!.",
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
          notifyContent: (error as Error).message,
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
        <TableData<LetterDetails>
          dataSource={letterDetails.map((item, index) => ({
            ...item,
            key: index,
            no: index + 1,
          }))}
          columns={columns}
          showModalOnRowClick
          type="suratDataDetails"
        />
      </div>


      {/* Modal Detail Surat */}
      <ModalDetailLetter
        visible={isModalOpen}
        onClose={closeModal}
        data={letterData}
      />

      {/* Form Edit Detail Surat */}
      <ModalEditDetailLetter
        visible={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        data={selectedRecord as LetterDetails}
      />

      {/* loading for waiting result classification */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50">
          <Spin size="large" tip="Loading..." />
        </div>
      )}

    </section>
  )
}
