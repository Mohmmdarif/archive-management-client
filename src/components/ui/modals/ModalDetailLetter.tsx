import { Modal, Row, Col, Descriptions, Button, Space, Input, DatePicker, Select, Form } from "antd";
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
import useUserManagementStore from "../../../store/api/useUserManagementStore";

const { Option } = Select;

type Classification = {
  Classify: string;
  Criteria: string;
}[];

type EntitiesNER = {
  text: string;
  label: string;
}[];

interface LetterData {
  file: File | null;
  classification: Classification;
  entities: EntitiesNER;
  text: string;
  filePath: string;
}

interface LetterDetails {
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
  tanggal_kirim: Date | null;
}

interface DetailSuratProps {
  visible: boolean;
  onClose: () => void;
  data: LetterData[];
}

export default function ModalDetailLetter({ visible, onClose, data }: DetailSuratProps) {
  const [form] = useForm();
  const { notify, contextHolder } = useNotify();
  const { classifierData, fetchClassifierData } = useClassifierStore();
  const { typeData, fetchTypeData } = useTypeStore();
  const { categoryData, fetchCategoryData } = useCategoryStore();
  const { criteriaData, fetchCriteriaData } = useCriteriaStore();
  const { savedConfirmedData } = useLetterStore();
  const { userMe, isLoading, fetchUserManagementData } =
    useUserManagementStore();
  const { filename, file_path } = extractFilePathParts(data[0]?.filePath || "");

  useEffect(() => {
    fetchTypeData();
    fetchCategoryData();
    fetchCriteriaData();
    fetchClassifierData();
    fetchUserManagementData();
  }, [fetchTypeData, fetchCategoryData, fetchCriteriaData, fetchClassifierData, fetchUserManagementData]);

  console.log(userMe)
  useEffect(() => {
    if (visible && data.length > 0 && userMe) {
      const entity = data[0].entities;
      const classification = data[0].classification[0];

      form.setFieldsValue({
        no_agenda: null,
        tanggal_terima: null,
        jumlah_lampiran: null,
        created_at: dayjs(),
        pengarsip: userMe.nama_lengkap,
        no_surat: entity.find((e) => e.label === "NOMOR_SURAT")?.text ?? "",
        tanggal_surat: entity.find((e) => e.label === "TANGGAL_SURAT")?.text ? dayjs(entity.find((e) => e.label === "TANGGAL_SURAT")?.text) : null,
        id_type_surat: classifierData.find((type) => type.nama_type.toLowerCase() === classification?.Classify)?.id ?? "",
        perihal_surat: entity.find((e) => e.label === "PERIHAL")?.text ?? "",
        id_kategori_surat: "",
        id_kriteria_surat: criteriaData.find((criteria) => criteria.nama_kriteria.toLowerCase() === classification?.Criteria)?.id ?? "",
        id_jenis_surat: typeData.find((type) => type.nama_jenis === "Biasa")?.id ?? "",
        pengirim_surat: "",
        penerima_surat: "",
        filename: filename,
        path_file: file_path,
        tanggal_kirim: dayjs(),
      });
    }
  }, [visible, data, form, classifierData, criteriaData, typeData, filename, file_path, fetchUserManagementData, userMe]);

  const handleSave = async (values: LetterDetails) => {

    try {
      await savedConfirmedData(values);
      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Letter details saved successfully.",
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
      const response = await fetch(data[0]?.filePath, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data[0]?.file?.name || "file.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  function extractFilePathParts(filePath: string): { filename: string; file_path: string } {
    if (!filePath) return { filename: "", file_path: "" };

    const parts = filePath.split("/");
    const filename = parts.pop() ?? "";
    const file_path = parts.join("/") + "/";

    return { filename, file_path };
  }

  console.log("Data Surat:", data);
  return (
    <>
      {/* Notification Context */}
      {contextHolder}
      <Modal
        open={visible}
        title="Detail Surat"
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
        <Form
          layout="vertical"
          onFinish={handleSave}
          form={form}
        >
          <Row gutter={16} className="my-4">
            {
              data[0]?.classification[0]?.Classify === "surat masuk" ? (
                <Col span={12}>
                  <Descriptions title="Informasi Umum" bordered column={1} size="small">
                    <Descriptions.Item label="No. Agenda">
                      <Form.Item name="no_agenda" noStyle>
                        <Input />
                      </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tgl. Diterima">
                      <Form.Item name="tanggal_terima" noStyle>
                        <DatePicker format="DD MMMM YYYY" className="w-full" />
                      </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="Lampiran">
                      <Form.Item name="jumlah_lampiran" noStyle>
                        <Input />
                      </Form.Item>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              ) : null
            }
            <Col span={12}>
              <Descriptions title="Detail User" bordered column={1} size="small">
                <Descriptions.Item label="Tgl. Diarsipkan">
                  <Form.Item name="created_at" noStyle>
                    <DatePicker format="DD MMMM YYYY" className="w-full" bordered={false} value={dayjs(form.getFieldValue("created_at"))?.isValid()
                      ? dayjs(form.getFieldValue("created_at")).format("DD MMMM YYYY")
                      : "-"} readOnly />
                  </Form.Item>
                </Descriptions.Item>
                <Descriptions.Item label="Pengarsip">
                  <Form.Item name="pengarsip" noStyle>
                    <Input bordered={false} value={isLoading ? "-" : form.getFieldValue("pengarsip")} readOnly />
                  </Form.Item>
                  {

                  }</Descriptions.Item>
              </Descriptions>
            </Col>
          </Row>


          <Descriptions title="Informasi Detail Surat" bordered column={1} size="small">
            <Descriptions.Item label="No. Surat">
              <Form.Item name="no_surat" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Tgl. Surat">
              <Form.Item name="tanggal_surat" noStyle>
                <DatePicker format="DD MMMM YYYY" className="w-full" />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Tipe Surat">
              <Form.Item name="id_type_surat" noStyle>
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
              <Form.Item name="perihal_surat" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Jenis Surat">
              <Form.Item name="id_jenis_surat" noStyle>
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
              <Form.Item name="id_kriteria_surat" noStyle>
                <Select className="w-full capitalize">
                  {criteriaData.map((criteria) => (
                    <Option key={criteria.id} value={criteria.id}>
                      {criteria.nama_kriteria}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Descriptions.Item>
            {
              data[0]?.classification[0]?.Classify === "surat masuk" ? (
                <Descriptions.Item label="Kategori Surat">
                  <Form.Item name="id_kategori_surat" noStyle>
                    <Select className="w-full">
                      {categoryData.map((category) => (
                        <Option key={category.id} value={category.id}>
                          {category.nama_kategori}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Descriptions.Item>
              ) : null
            }
            <Descriptions.Item label="Pengirim Surat">
              <Form.Item name="pengirim_surat" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="Penerima Surat">
              <Form.Item name="penerima_surat" noStyle>
                <Input />
              </Form.Item>
            </Descriptions.Item>
            {
              data[0]?.classification[0]?.Classify === "surat keluar" ? (
                <Descriptions.Item label="Tgl. Kirim Surat">
                  <Form.Item name="tanggal_kirim" noStyle>
                    <DatePicker format="DD MMMM YYYY" className="w-full" />
                  </Form.Item>
                </Descriptions.Item>
              ) : null
            }
            <Descriptions.Item label="File Path" className="hidden">
              <Form.Item name="path_file" noStyle>
                <Input type="hidden" value={file_path} readOnly bordered={false} />
              </Form.Item>
            </Descriptions.Item>
            <Descriptions.Item label="File Name" className="hidden">
              <Form.Item name="filename" noStyle>
                <Input type="hidden" value={filename} readOnly bordered={false} />
              </Form.Item>
            </Descriptions.Item>

            <Descriptions.Item label="File">
              <Space>
                <Button type="primary" size="small" onClick={() => encodeURI(data[0]?.filePath) && window.open(data[0]?.filePath, "_blank")}>
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
