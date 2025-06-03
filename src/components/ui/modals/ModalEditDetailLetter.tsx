import {
  Modal,
  Row,
  Col,
  Descriptions,
  Button,
  Space,
  Input,
  DatePicker,
  Select,
  Form,
} from "antd";
import { useEffect } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import dayjs from "dayjs";
import useTypeStore from "../../../store/api/useTypeStore";
import useCategoryStore from "../../../store/api/useCategoryStore";
import useCriteriaStore from "../../../store/api/useCriteriaStore";
import { useForm } from "antd/es/form/Form";
import useClassifierStore from "../../../store/api/useClassifierStore";
import useLetterStore from "../../../store/api/useLetterStore";
import useNotify from "../../../hooks/useNotify";
import { getErrorMessage } from "../../../libs/utils/errorHandler";

const { Option } = Select;

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

interface DetailSuratProps {
  visible: boolean;
  onClose: () => void;
  data: LetterDetails;
}

export default function ModalEditDetailLetter({
  visible,
  onClose,
  data,
}: DetailSuratProps) {
  const [form] = useForm();
  const { notify, contextHolder } = useNotify();
  const { typeData, fetchTypeData } = useTypeStore();
  const { categoryData, fetchCategoryData } = useCategoryStore();
  const { criteriaData, fetchCriteriaData } = useCriteriaStore();
  const { classifierData, fetchClassifierData } = useClassifierStore();
  const { updateData, fetchSuratData } = useLetterStore();

  useEffect(() => {
    fetchTypeData();
    fetchCategoryData();
    fetchCriteriaData();
    fetchClassifierData();
  }, [
    fetchTypeData,
    fetchCategoryData,
    fetchCriteriaData,
    fetchClassifierData,
  ]);

  useEffect(() => {
    if (visible && data) {
      form.setFieldsValue({
        id: data.id,
        created_at: data.created_at ? dayjs(data.created_at) : null,
        pengarsip: data.pengarsip ?? "",
        no_surat: data.no_surat ?? "",
        tanggal_surat: data.tanggal_surat ? dayjs(data.tanggal_surat) : null,
        id_type_surat: data.id_type_surat ?? 1,
        perihal_surat: data.perihal_surat ?? "",
        id_kriteria_surat: data.id_kriteria_surat ?? "",
        id_jenis_surat: data.id_jenis_surat ?? "",
        pengirim_surat: data.pengirim_surat ?? "",
        penerima_surat: data.penerima_surat ?? "",
        filename: data.filename ?? "",
        path_file: data.path_file ?? "",

        no_agenda: data.Surat_Masuk?.[0]?.no_agenda ?? "",
        id_kategori_surat: data.Surat_Masuk?.[0]?.id_kategori_surat ?? "",
        tanggal_terima: data.Surat_Masuk?.[0]?.tanggal_terima
          ? dayjs(data.Surat_Masuk?.[0]?.tanggal_terima)
          : null,
        jumlah_lampiran: data.Surat_Masuk?.[0]?.jumlah_lampiran ?? null,

        tanggal_kirim: data.surat_keluar?.[0]?.tanggal_kirim
          ? dayjs(data.surat_keluar?.[0]?.tanggal_kirim)
          : null,
      });
    }
  }, [visible, data, form]);

  const handleSave = async (values: LetterDetails) => {
    try {
      await updateData(values?.id, values);
      await fetchSuratData();

      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Data has been successfully updated.",
      });
    } catch (error) {
      notify({
        type: "error",
        notifyTitle: "Error!",
        notifyContent: getErrorMessage(error as Error),
      });
    } finally {
      form.resetFields();
      onClose();
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(data.path_file, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.filename || "file.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      {/* Notification Context */}
      {contextHolder}
      <Modal
        open={visible}
        title="Edit Detail Surat"
        onCancel={onClose}
        footer={[
          <Button key="cancel" onClick={onClose}>
            Batal
          </Button>,
          <Button key="save" type="primary" onClick={() => form.submit()}>
            Simpan
          </Button>,
        ]}
        width={800}
      >
        <Form layout="vertical" onFinish={handleSave} form={form}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="tanggal_terima" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="jumlah_lampiran" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16} className="my-4">
            {data?.id_type_surat === 1 ? (
              <Col span={12}>
                <Descriptions
                  title="Informasi Umum"
                  bordered
                  column={1}
                  size="small"
                  labelStyle={{ width: "30%", fontWeight: "revert" }}
                >
                  <Descriptions.Item label="No. Agenda">
                    <Form.Item
                      name="no_agenda"
                      noStyle
                      rules={[
                        { required: true, message: "No. Agenda wajib diisi" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Descriptions.Item>

                  <Descriptions.Item label="Tgl. Diterima">
                    <Form.Item
                      name="tanggal_terima"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Tgl. Diterima wajib diisi",
                        },
                      ]}
                    >
                      <DatePicker format="DD MMMM YYYY" className="w-full" />
                    </Form.Item>
                  </Descriptions.Item>

                  <Descriptions.Item label="Lampiran">
                    <Form.Item
                      name="jumlah_lampiran"
                      noStyle
                      rules={[
                        {
                          required: true,
                          message: "Jumlah Lampiran wajib diisi",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
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
                labelStyle={{ width: "40%", fontWeight: "revert" }}
              >
                <Descriptions.Item label="Tgl. Diarsipkan">
                  <Form.Item
                    name="created_at"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: "Tgl. Diarsipkan wajib diisi",
                      },
                    ]}
                  >
                    <DatePicker
                      format="DD MMMM YYYY"
                      className="w-full"
                      variant="borderless"
                      value={
                        dayjs(form.getFieldValue("created_at"))?.isValid()
                          ? dayjs(form.getFieldValue("created_at")).format(
                            "DD MMMM YYYY"
                          )
                          : "-"
                      }
                      disabled
                    />
                  </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="Pengarsip">
                  <Form.Item
                    name="pengarsip"
                    noStyle
                    rules={[
                      { required: true, message: "Pengarsip wajib diisi" },
                    ]}
                  >
                    <Input
                      variant="borderless"
                      value={form.getFieldValue("pengarsip")}
                      readOnly
                    />
                  </Form.Item>
                  { }
                </Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>

          <Descriptions
            title="Informasi Detail Surat"
            bordered
            column={1}
            size="small"
            labelStyle={{ width: "30%", fontWeight: "revert" }}
          >
            <Descriptions.Item label="No. Surat">
              <Form.Item
                name="no_surat"
                noStyle
                rules={[{ required: true, message: "No. Surat wajib diisi" }]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Tgl. Surat">
              <Form.Item
                name="tanggal_surat"
                noStyle
                rules={[{ required: true, message: "Tgl. Surat wajib diisi" }]}
              >
                <DatePicker format="DD MMMM YYYY" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Tipe Surat">
              <Form.Item
                name="id_type_surat"
                noStyle
                rules={[{ required: true, message: "Tipe Surat wajib diisi" }]}
              >
                <Select className="w-full capitalize">
                  {classifierData.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.nama_type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Perihal">
              <Form.Item
                name="perihal_surat"
                noStyle
                rules={[
                  { required: true, message: "Perihal Surat wajib diisi" },
                ]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Surat">
              <Form.Item
                name="id_jenis_surat"
                noStyle
                rules={[{ required: true, message: "Jenis Surat wajib diisi" }]}
              >
                <Select className="w-full">
                  {typeData.map((type) => (
                    <Option key={type.id} value={type.id}>
                      {type.nama_jenis}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Kriteria Surat">
              <Form.Item
                name="id_kriteria_surat"
                noStyle
                rules={[
                  { required: true, message: "Kriteria Surat wajib diisi" },
                ]}
              >
                <Select className="w-full capitalize">
                  {criteriaData.map((criteria) => (
                    <Option key={criteria.id} value={criteria.id}>
                      {criteria.nama_kriteria}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            {data?.id_type_surat === 1 ? (
              <Descriptions.Item label="Kategori Surat">
                <Form.Item
                  name="id_kategori_surat"
                  noStyle
                  rules={[
                    { required: true, message: "Kategori Surat wajib diisi" },
                  ]}
                >
                  <Select className="w-full">
                    {categoryData.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.nama_kategori}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="Pengirim Surat">
              <Form.Item
                name="pengirim_surat"
                noStyle
                rules={[
                  { required: true, message: "Pengirim Surat wajib diisi" },
                ]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Penerima Surat">
              <Form.Item
                name="penerima_surat"
                noStyle
                rules={[
                  { required: true, message: "Penerima Surat wajib diisi" },
                ]}
              >
                <Input />
              </Form.Item>
            </Descriptions.Item>
            {data?.id_type_surat === 2 ? (
              <Descriptions.Item label="Tgl. Kirim Surat">
                <Form.Item
                  name="tanggal_kirim"
                  noStyle
                  rules={[
                    { required: true, message: "Tgl. Kirim Surat wajib diisi" },
                  ]}
                >
                  <DatePicker format="DD MMMM YYYY" className="w-full" />
                </Form.Item>
              </Descriptions.Item>
            ) : null}
            <Descriptions.Item label="File Path" className="hidden">
              <Form.Item name="path_file" noStyle>
                <Input
                  type="hidden"
                  value={data?.path_file}
                  readOnly
                  variant="borderless"
                />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="File Name" className="hidden">
              <Form.Item name="filename" noStyle>
                <Input
                  type="hidden"
                  value={data?.filename}
                  readOnly
                  variant="borderless"
                />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="File">
              <Space>
                <Button
                  type="primary"
                  size="small"
                  onClick={() =>
                    data.path_file && window.open(data.path_file, "_blank")
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
        </Form>
      </Modal>
    </>
  );
}
