import { Modal, Row, Col, Descriptions, Button, Space } from "antd";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import dayjs from "dayjs";

import useTypeStore from "../../../store/api/useTypeStore";
import useClassifierStore from "../../../store/api/useClassifierStore";
import useCriteriaStore from "../../../store/api/useCriteriaStore";
import useCategoryStore from "../../../store/api/useCategoryStore";

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

export interface LetterDetails {
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
}

interface LetterDetailsViewOnlyProps {
  letterDetails: LetterDetails;
  visible: boolean;
  onClose: () => void;
}

export default function LetterDetailsViewOnly({
  letterDetails,
  visible,
  onClose,
}: LetterDetailsViewOnlyProps) {
  const { classifierData } = useClassifierStore();
  const { typeData } = useTypeStore();
  const { criteriaData } = useCriteriaStore();
  const { categoryData } = useCategoryStore();

  return (
    <Modal
      open={visible}
      title="Detail Surat"
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Batal
        </Button>,
      ]}
      width={900}
    >
      <Row gutter={16} className="my-4">
        {letterDetails.id_type_surat === 1 ? (
          <Col span={12}>
            <Descriptions
              title="Informasi Umum"
              bordered
              column={1}
              size="small"
              labelStyle={{ width: "30%", fontWeight: "revert" }}

            >
              <Descriptions.Item label="No. Agenda">
                <span>{letterDetails?.Surat_Masuk?.[0].no_agenda || "-"}</span>
              </Descriptions.Item>

              <Descriptions.Item label="Tgl. Diterima">
                <span>
                  {letterDetails.Surat_Masuk?.[0].tanggal_terima
                    ? dayjs(
                      letterDetails.Surat_Masuk?.[0].tanggal_terima
                    ).format("DD MMMM YYYY")
                    : "-"}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Lampiran">
                <span>{letterDetails.Surat_Masuk?.[0].jumlah_lampiran}</span>
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
                {letterDetails.created_at
                  ? dayjs(letterDetails.created_at).format("DD MMMM YYYY")
                  : "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Pengarsip">
              <span>{letterDetails.pengarsip}</span>
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
              <span>{letterDetails.no_surat}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Tgl. Surat">
              <span>
                {letterDetails.tanggal_surat
                  ? dayjs(letterDetails.tanggal_surat).format("DD MMMM YYYY")
                  : "-"}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Tipe Surat">
              <span>
                {
                  classifierData.find(
                    (item) => item.id === letterDetails.id_type_surat
                  )?.nama_type
                }
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Perihal Surat">
              <span>{letterDetails.perihal_surat}</span>
            </Descriptions.Item>

            <Descriptions.Item label="Jenis Surat">
              <span>
                {
                  typeData.find(
                    (items) => items.id === letterDetails.id_jenis_surat
                  )?.nama_jenis
                }
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Kriteria Surat">
              <span>
                {
                  criteriaData.find(
                    (items) => items.id === letterDetails.id_kriteria_surat
                  )?.nama_kriteria
                }
              </span>
            </Descriptions.Item>
            {letterDetails.id_type_surat === 1 ? (
              <Descriptions.Item label="Kategori Surat">
                {
                  categoryData.find(
                    (items) =>
                      items.id ===
                      letterDetails.Surat_Masuk?.[0].id_kategori_surat
                  )?.nama_kategori
                }
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="Pengirim">
              <span>{letterDetails.pengirim_surat}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Penerima">
              <span>{letterDetails.penerima_surat}</span>
            </Descriptions.Item>
            {letterDetails.id_type_surat === 2 ? (
              <Descriptions.Item label="Tanggal Kirim Surat">
                <span>
                  {letterDetails.surat_keluar?.[0].tanggal_kirim
                    ? dayjs(
                      letterDetails.surat_keluar?.[0].tanggal_kirim
                    ).format("DD MMMM YYYY") : "-"}
                </span>
              </Descriptions.Item>
            ) : null}

            <Descriptions.Item label="File">
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    encodeURI(letterDetails.path_file) &&
                    window.open(letterDetails.path_file, "_blank")
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
      </Row>
    </Modal>
  );

  // Handle file download
  async function handleDownload() {
    try {
      const response = await fetch(letterDetails.path_file, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = letterDetails.filename || "file.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
}
