import { Modal, Row, Col, Descriptions, Button, Space } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import dayjs from "dayjs";

import useTypeStore from "../../../store/api/useTypeStore";
import useClassifierStore from "../../../store/api/useClassifierStore";
import useCriteriaStore from "../../../store/api/useCriteriaStore";
import useCategoryStore from "../../../store/api/useCategoryStore";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import { useEffect } from "react";
import useLetterStore from "../../../store/api/useLetterStore";
import { getErrorMessage } from "../../../libs/utils/errorHandler";
import { NotifyProps } from "../../../hooks/useNotify";

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

export interface LetterDetailsToDelete {
  id: string;
  tanggal_terima?: Date | null;
  jumlah_lampiran?: number | null;
  created_at: Date;
  pengarsip: string; // User who archived the letter
  no_surat: string;
  tanggal_surat: Date | null;
  id_type_surat: number;
  perihal_surat: string;
  id_kriteria_surat: number;
  id_jenis_surat: number;
  pengirim_surat: string;
  penerima_surat: string; // penerima surat (text)
  filename: string;
  path_file: string;
  Surat_Masuk?: SuratMasuk[];
  surat_keluar?: SuratKeluar[];
  status_penghapusan_surat: "REQUESTED" | "APPROVED" | "REJECTED";
  alasan_penghapusan_surat: string | null;
  id_user_pengaju_penghapusan: string | null;
  is_deleted: boolean;
}

interface LetterRequestToDeleteProps {
  letterDetailsToDelete: LetterDetailsToDelete;
  visible: boolean;
  onClose: () => void;
  notifyFunction?: (notification: NotifyProps) => void;
}

export default function LetterRequestToDelete({
  letterDetailsToDelete,
  visible,
  onClose,
  notifyFunction,
}: LetterRequestToDeleteProps) {
  const { classifierData } = useClassifierStore();
  const { typeData } = useTypeStore();
  const { criteriaData } = useCriteriaStore();
  const { categoryData } = useCategoryStore();
  const { userManagementData, fetchUserManagementData } =
    useUserManagementStore();
  const { fetchSuratData, rejectDeleteRequest, approveDeleteRequest, deleteCloudinaryFile } =
    useLetterStore();

  useEffect(() => {
    if (visible) {
      fetchUserManagementData();
    }
  }, [visible, fetchUserManagementData]);

  // Find the user who submitted the deletion request
  const userRequestToDelete = userManagementData.find(
    (user) => user.id === letterDetailsToDelete.id_user_pengaju_penghapusan
  );

  const handleApproveToDelete = async (id: string, filename: string, e: React.MouseEvent) => {
    e.stopPropagation();

    Modal.confirm({
      title: "Approve Deletion Request",
      content: "Are you sure you want to approve this deletion letter data request?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await approveDeleteRequest(id)
          deleteCloudinaryFile(filename);
          await fetchSuratData();
          onClose();

          // Show notification
          notifyFunction?.({
            type: "success",
            notifyTitle: "Success!",
            notifyContent: "Letter data has been successfully deleted.",
          });
        } catch (error) {
          notifyFunction?.({
            type: "error",
            notifyTitle: "Error!",
            notifyContent: getErrorMessage(error as Error),
          });
        }
      }
    });
  };

  const handleRejectToDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    Modal.confirm({
      title: "Reject Deletion Request",
      content: "Are you sure you want to reject this deletion request?",
      okText: "Reject",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await rejectDeleteRequest(id);
          await fetchSuratData();
          onClose();

          notifyFunction?.({
            type: "success",
            notifyTitle: "Success!",
            notifyContent: "Deletion request has been rejected.",
          });
        } catch (error) {
          notifyFunction?.({
            type: "error",
            notifyTitle: "Error!",
            notifyContent: getErrorMessage(error as Error),
          });
        }
      },
    });
  };

  return (
    <Modal
      open={visible}
      title="Detail Surat Pengajuan Penghapusan"
      onCancel={onClose}
      footer={[
        <>
          <Button
            key="reject"
            onClick={(e) => handleRejectToDelete(letterDetailsToDelete?.id, e)}
            danger
          >
            Reject
          </Button>
          <Button
            key="approve"
            type="primary"
            color="green"
            variant="solid"
            onClick={(e) => handleApproveToDelete(letterDetailsToDelete?.id, letterDetailsToDelete?.filename, e)}
          >
            Approve
          </Button>
        </>,
      ]}
      width={900}
    >
      <Row gutter={16} className="my-4">
        {letterDetailsToDelete?.id_type_surat === 1 ? (
          <Col span={12}>
            <Descriptions
              title="Informasi Umum"
              bordered
              column={1}
              size="small"
              labelStyle={{ width: "30%", fontWeight: "revert" }}
            >
              <Descriptions.Item label="No. Agenda">
                <span>
                  {letterDetailsToDelete?.Surat_Masuk?.[0]?.no_agenda || "-"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Tgl. Diterima">
                <span>
                  {letterDetailsToDelete?.Surat_Masuk?.[0]?.tanggal_terima
                    ? dayjs(
                      letterDetailsToDelete?.Surat_Masuk?.[0].tanggal_terima
                    ).format("DD MMMM YYYY")
                    : "-"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Lampiran">
                <span>
                  {letterDetailsToDelete?.Surat_Masuk?.[0]?.jumlah_lampiran === 0
                    ? "Tidak ada"
                    : letterDetailsToDelete?.Surat_Masuk?.[0]?.jumlah_lampiran}
                </span>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        ) : null}

        <Col span={12}>
          <Descriptions
            title="Detail User"
            bordered
            column={1}
            size="small"
            labelStyle={{ width: "35%", fontWeight: "revert" }}
          >
            <Descriptions.Item label="Tgl. Diarsipkan">
              <span>
                {letterDetailsToDelete?.created_at
                  ? dayjs(letterDetailsToDelete?.created_at).format(
                    "DD MMMM YYYY"
                  )
                  : "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Pengarsip">
              <span>{letterDetailsToDelete?.pengarsip}</span>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24} className="mt-4">
          <Descriptions
            title="Informasi Detail Surat"
            bordered
            column={1}
            size="small"
            labelStyle={{ width: "30%", fontWeight: "revert" }}
          >
            <Descriptions.Item label="No. Surat">
              <span>{letterDetailsToDelete?.no_surat}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Tgl. Surat">
              <span>
                {letterDetailsToDelete?.tanggal_surat
                  ? dayjs(letterDetailsToDelete?.tanggal_surat).format(
                    "DD MMMM YYYY"
                  )
                  : "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Tipe Surat">
              <span>
                {
                  classifierData.find(
                    (item) => item.id === letterDetailsToDelete?.id_type_surat
                  )?.nama_type
                }
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Perihal Surat">
              <span>{letterDetailsToDelete?.perihal_surat}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Jenis Surat">
              <span>
                {
                  typeData.find(
                    (items) => items.id === letterDetailsToDelete?.id_jenis_surat
                  )?.nama_jenis
                }
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Kriteria Surat">
              <span>
                {
                  criteriaData.find(
                    (items) =>
                      items.id === letterDetailsToDelete?.id_kriteria_surat
                  )?.nama_kriteria
                }
              </span>
            </Descriptions.Item>
            {letterDetailsToDelete?.id_type_surat === 1 ? (
              <Descriptions.Item label="Kategori Surat">
                {
                  categoryData.find(
                    (items) =>
                      items.id ===
                      letterDetailsToDelete?.Surat_Masuk?.[0].id_kategori_surat
                  )?.nama_kategori
                }
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="Pengirim">
              <span>{letterDetailsToDelete?.pengirim_surat}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Penerima">
              <span>{letterDetailsToDelete?.penerima_surat}</span>
            </Descriptions.Item>
            {letterDetailsToDelete?.id_type_surat === 2 ? (
              <Descriptions.Item label="Tanggal Kirim Surat">
                <span>
                  {letterDetailsToDelete?.surat_keluar?.[0].tanggal_kirim
                    ? dayjs(
                      letterDetailsToDelete?.surat_keluar?.[0].tanggal_kirim
                    ).format("DD MMMM YYYY")
                    : "-"}
                </span>
              </Descriptions.Item>
            ) : null}

            <Descriptions.Item label="File">
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    encodeURI(letterDetailsToDelete?.path_file) &&
                    window.open(letterDetailsToDelete?.path_file, "_blank")
                  }
                >
                  <IoEyeOutline />
                  Pratinjau
                </Button>
                <Button size="small" onClick={handleDownload}>
                  <MdOutlineFileDownload />
                  Unduh
                </Button>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Col>

        <Col span={24} className="mt-4 bg-slate-50 p-4 rounded-lg">
          <Descriptions
            title="Informasi Pengajuan Penghapusan"
            bordered
            column={1}
            size="small"
            labelStyle={{ width: "30%", fontWeight: "revert", color: "red" }}
          >
            <Descriptions.Item label="Pengaju">
              <span>
                {letterDetailsToDelete?.id_user_pengaju_penghapusan
                  ? userRequestToDelete?.nama_lengkap
                  : "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Alasan">
              <span>
                {letterDetailsToDelete?.alasan_penghapusan_surat || "-"}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Modal>
  );

  // Handle file download
  async function handleDownload() {
    try {
      const response = await fetch(letterDetailsToDelete?.path_file, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = letterDetailsToDelete?.filename || "file.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
}
