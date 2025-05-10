import { Alert, Badge, Button, Flex, Modal, Space, Spin, Upload } from "antd";
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
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { IoArrowRedoOutline, IoEyeOutline } from "react-icons/io5";
import useClassifierStore from "../../../store/api/useClassifierStore";
import ModalEditDetailLetter from "../modals/ModalEditDetailLetter";
import Loading from "../Loading";
import useAuthStore from "../../../store/api/useAuthStore";
import { useNavigate } from "react-router";
import useSearchStore from "../../../store/useSearch";
import { filterData } from "../../../libs/utils/filterData";

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
  const navigate = useNavigate();
  const {
    letterData,
    letterDetails,
    isLoading,
    addData,
    fetchSuratData,
    deleteData,
  } = useLetterStore();
  const { notify, contextHolder } = useNotify();
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const { searchQuery } = useSearchStore();
  const { classifierData, fetchClassifierData } = useClassifierStore();
  const [selectedRecord, setSelectedRecord] = useState<LetterDetails | null>(
    null
  );
  const [isModalEditOpen, setIsModalEditOpen] = useState<boolean>(false);
  const getRole = useAuthStore((state) => state.getRole);
  const roleId = getRole();

  useEffect(() => {
    fetchSuratData();
    fetchClassifierData();
  }, [fetchSuratData, fetchClassifierData]);

  const processedData = useMemo(() => {
    const data = Array.isArray(letterDetails) ? letterDetails : [];
    if (roleId === 3) {
      // Filter hanya surat masuk
      return data
        .filter((item) => item.Surat_Masuk && item.Surat_Masuk.length > 0)
        .map((item, index) => ({
          ...item,
          key: index,
          no: index + 1,
        }));
    } else if (roleId === 4) {
      // Filter hanya surat keluar
      return data
        .filter((item) => item.surat_keluar && item.surat_keluar.length > 0)
        .map((item, index) => ({
          ...item,
          key: index,
          no: index + 1,
        }));
    } else {
      // Role 1 dan 2: Tampilkan semua data
      return data?.map((item, index) => ({
        ...item,
        key: index,
        no: index + 1,
      }));
    }
  }, [letterDetails, roleId]);

  const filteredData = filterData(
    Array.isArray(processedData) ? processedData : [],
    searchQuery,
    ["no_surat", "perihal_surat", "pengirim_surat", "penerima_surat"]
  );

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
    setSelectedRecord(record);
    setIsModalEditOpen(true);
  };

  const handlePreview = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(path, "_blank");
  };

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
          notifyContent:
            "File berhasil diklasifikasikan, Harap periksa detail surat sebelum menyimpan data!.",
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

  const columns: ColumnsType<LetterDetails> = useMemo(
    () => [
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
        render: (text) => (
          <span className="text-ellipsis line-clamp-1">{text}</span>
        ),
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
        render: (text) => (
          <span className="text-ellipsis line-clamp-1">{text}</span>
        ),
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
        render: (path) => (
          <Button
            type="default"
            size="middle"
            onClick={(e) => handlePreview(path, e)}
          >
            <IoEyeOutline />
            Pratinjau
          </Button>
        ),
      },
      {
        title: "Action",
        key: "action",
        align: "center",
        render: (_, record) => {
          // Periksa apakah disposisi sudah dibuat
          const isDisposisiCreated =
            record.Surat_Masuk?.[0]?.id_status_disposisi &&
            record.Surat_Masuk[0].id_status_disposisi !== 1;

          return (
            <Space size="small">
              {[1, 2, 3, 5].includes(roleId) && record.id_type_surat === 1 && (
                <ButtonIcon
                  tooltipTitle={`${isDisposisiCreated ? "Pratinjau" : "Ajukan"
                    }`}
                  shape="circle"
                  icon={
                    isDisposisiCreated ? (
                      <IoEyeOutline />
                    ) : (
                      <IoArrowRedoOutline />
                    )
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/arsip/disposisi/${record.id}`);
                  }}
                />
              )}
              {![2, 5].includes(roleId) && (
                <>
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
                </>
              )}
            </Space>
          );
        },
      },
    ],
    [classifierData]
  );

  return (
    <section className="bg-white w-full h-full flex flex-col p-5 rounded-lg relative">
      {/* Notify Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader
        subHeaderTitle={
          [1, 2, 5].includes(roleId)
            ? "Data Surat"
            : roleId === 3
              ? "Data Surat Masuk"
              : "Data Surat Keluar"
        }
      />

      {/* Search */}
      <Flex
        justify="space-between"
        align="start"
        style={{ marginBottom: 15, marginTop: 15 }}
        gap={10}
      >
        <Search>
          {/* Note untuk informasi pencarian */}
          {" "}
          <strong>Catatan:</strong> Anda dapat mencari berdasarkan{" "}
          <em>"No Surat"</em>, <em>"Perihal Surat"</em>,{" "}
          <em>"Pengirim Surat"</em>, atau <em>"Penerima Surat"</em>.
        </Search>

        <Upload
          accept=".pdf"
          customRequest={handleUpload}
          showUploadList={false}
        >
          {![2].includes(roleId) && (
            <ButtonIcon
              type="primary"
              icon={isLoading ? <Spin size="small" /> : <BiPlus />}
              size="middle"
              shape="default"
              disabled={isLoading}
            >
              Upload Surat
            </ButtonIcon>
          )}
        </Upload>
      </Flex>

      {/* Table Data */}
      <div
        className="overflow-y-auto flex-grow"
        style={{
          maxHeight: "calc(100vh - 250px)",
        }}
      >
        <TableData<LetterDetails>
          dataSource={filteredData}
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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
          <Loading />
        </div>
      )}
    </section>
  );
}
