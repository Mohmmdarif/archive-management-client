// Libraries
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";
import {
  Alert,
  Button,
  Divider,
  Form,
  Input,
  Select,
  Tag,
  Timeline,
  Typography,
} from "antd";

// Hooks and Store
import useAuthStore from "../../../store/api/useAuthStore";
import useLetterStore from "../../../store/api/useLetterStore";
import useDisposisiStore from "../../../store/api/useDisposisiStore";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import useNotify from "../../../hooks/useNotify";
import { getColor, getInitial } from "../../../libs/utils/randomProfile";
import { getJabatan } from "../../../libs/utils/getRole";

// Components
import TextArea from "antd/es/input/TextArea";

// Icons
import { BiArrowFromRight } from "react-icons/bi";
import { getErrorMessage } from "../../../libs/utils/errorHandler";

const { Text } = Typography;
const { Option } = Select;

interface DisposisiCreate {
  id_surat_masuk: string;
  id_pengaju: string;
  id_penerima: string;
  pesan_disposisi: string;
  id_status_disposisi: number;
  parent_disposisi_id: string | null;
}

export default function DisposisiDetailContainer() {
  const navigate = useNavigate();
  const [form] = useForm();
  const { id } = useParams<{ id: string }>();
  const { notify, contextHolder } = useNotify();
  const { letterDetails, fetchSuratById } = useLetterStore();
  const { userManagementData, fetchUserManagementData } =
    useUserManagementStore();
  const {
    disposisiData,
    disposisiStatus,
    fetchDisposisiBySuratMasukId,
    fetchDisposisiStatus,
    createDisposisi,
  } = useDisposisiStore();
  const [parentDisposisiId, setParentDisposisiId] = useState<string | null>(
    null
  );
  const { getUserId, getRole } = useAuthStore();
  const userId = getUserId();
  const roleId = getRole();
  const [formVisible, setFormVisible] = useState(false);
  const [timelineMode, setTimelineMode] = useState<"alternate" | "left">(
    window.innerWidth <= 768 ? "left" : "alternate"
  );

  // jika user dengan id ini belum memiliki jabatan maka tidak bisa melakukan disposisi
  const userWithNoJabatan = userManagementData.find(
    (user) => user.id === userId && !user.jabatan
  );

  const isRoleDekan = userManagementData.some(
    (user) => user.id === userId && roleId === 2 && user.jabatan.toLowerCase() === "dekan"
  );

  // Ambil disposisi terakhir
  const lastDisposisi = disposisiData[disposisiData.length - 1];
  const lastStatusId = lastDisposisi?.id_status_disposisi;

  // Periksa apakah user yang sedang login adalah penerima disposisi terakhir
  const isUserPenerimaDisposisi =
    disposisiData.length > 0 &&
    disposisiData[disposisiData.length - 1]?.id_penerima === userId;

  // Periksa apakah pengguna sudah melakukan disposisi
  const hasUserDisposisi = disposisiData.some(
    (disposisi) => disposisi.id_pengaju === userId
  );

  useEffect(() => {
    const handleResize = () => {
      setTimelineMode(window.innerWidth <= 768 ? "left" : "alternate");
    };

    // Tambahkan event listener untuk resize
    window.addEventListener("resize", handleResize);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetchSuratById(id);
    }
  }, [id, fetchSuratById]);

  useEffect(() => {
    const suratMasukId = letterDetails?.Surat_Masuk?.[0]?.id;
    if (suratMasukId) {
      fetchDisposisiBySuratMasukId(suratMasukId);
    }
  }, [letterDetails, fetchDisposisiBySuratMasukId]);

  useEffect(() => {
    if (letterDetails?.Surat_Masuk?.[0]?.id) {
      form.setFieldsValue({
        id_surat_masuk: letterDetails.Surat_Masuk[0].id,
        id_pengaju: userId,
      });
    }
  }, [letterDetails, userId, form]);

  useEffect(() => {
    if (disposisiData.length > 0) {
      setParentDisposisiId(
        disposisiData[disposisiData.length - 1].parent_disposisi_id
      );
    }
  }, [disposisiData]);

  useEffect(() => {
    fetchDisposisiStatus();
    fetchUserManagementData();
  }, [fetchDisposisiStatus, fetchUserManagementData]);


  const handleCreateDisposisi = async (values: DisposisiCreate) => {
    try {
      const payload = {
        ...values,
        parent_disposisi_id: parentDisposisiId, // Menambahkan parent_disposisi_id
      };
      await createDisposisi(payload);
      if (id) {
        await fetchDisposisiBySuratMasukId(id);
      }
      setTimeout(() => {
        navigate("/arsip");
        form.resetFields();
      }, 1500);
      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Disposisi has been successfully created.",
      });
    } catch (error) {
      if (error instanceof Error) {
        notify({
          type: "error",
          notifyTitle: "Error!",
          notifyContent: getErrorMessage(error as Error),
        });
      }
    }
  };

  const displayName = disposisiData.length > 0
    ? {
      nama_lengkap: disposisiData[disposisiData.length - 1]?.pengaju?.nama_lengkap || "Tidak Diketahui",
      jabatan: disposisiData[disposisiData.length - 1]?.pengaju?.jabatan || "Tidak Diketahui"
    }
    : roleId === 5
      ? {
        nama_lengkap: "Tidak Diketahui",
        jabatan: "Tidak Diketahui"
      }
      : userManagementData.find((user) => user.id === userId)
        ? {
          nama_lengkap: userManagementData.find((user) => user.id === userId)?.nama_lengkap || "Tidak Diketahui",
          jabatan: userManagementData.find((user) => user.id === userId)?.jabatan || "Tidak Diketahui"
        }
        : {
          nama_lengkap: "Tidak Diketahui",
          jabatan: "Tidak Diketahui"
        };




  const initialName = () => {
    if (disposisiData.length === 0) {
      // Jika tidak ada disposisi, gunakan nama pengirim surat
      return userManagementData.find((user) => user.id === userId)?.nama_lengkap || "";
    }

    const lastDisposisi = disposisiData[disposisiData.length - 1];

    if (
      lastDisposisi?.id_penerima === userId ||
      lastStatusId === 6 || // Selesai
      lastStatusId === 8 // Ditolak
    ) {
      // Jika user adalah penerima disposisi terakhir atau status selesai/ditolak
      return lastDisposisi?.pengaju?.nama_lengkap || "";
    }

    // Fallback ke nama pengguna yang sedang login
    return lastDisposisi?.pengaju?.nama_lengkap || "";
  };

  return (
    <section className="bg-white w-full h-auto p-5 rounded-lg">
      {/* Notify Context */}
      {contextHolder}

      <Text strong>
        {disposisiData.length > 0
          ? "Terusan dari :"
          : roleId === 5
            ? "Terusan dari :"
            : "Dari :"}
      </Text>
      <article className="mt-2">
        <div className="flex items-center gap-2 cursor-pointer p-2 rounded-lg w-fit">
          <div
            className="flex items-center justify-center bg-white p-3 rounded-lg shadow-md"
            style={{
              backgroundColor: getColor(
                getInitial(
                  initialName()
                )
              ),
              width: 50,
              height: 50,
              borderRadius: "50%",
            }}
          >
            <span className="text-white font-bold text-lg">
              {getInitial(
                initialName()
              )}
            </span>
          </div>
          <div className="flex flex-col text-left space-y-1">
            <span className="text-sm font-semibold">
              {displayName.nama_lengkap || "Tidak Diketahui"}
            </span>
            <span className="text-xs">
              {getJabatan(displayName.jabatan) || "Tidak Diketahui"}
            </span>
          </div>
        </div>
      </article>
      {/* no. agenda, no surat, tanggal surat, perihal, jumlah lampiran */}
      <article>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-5 mt-2">
          <div className="flex flex-col items-start gap-1 p-2 rounded-lg w-fit">
            <Text strong>No. Agenda</Text>
            <Text>{letterDetails?.Surat_Masuk?.[0]?.no_agenda}</Text>
          </div>
          <div className="flex flex-col items-start gap-1 p-2 rounded-lg w-fit">
            <Text strong>No. Surat</Text>
            <Text>{letterDetails?.no_surat}</Text>
          </div>
          <div className="flex flex-col items-start gap-1 p-2 rounded-lg w-fit">
            <Text strong>Tanggal Surat</Text>
            <Text>
              {letterDetails?.tanggal_surat
                ? dayjs(letterDetails?.tanggal_surat).format("DD MMMM YYYY")
                : "-"}
            </Text>
          </div>
          <div className="flex flex-col items-start gap-1 p-2 rounded-lg w-fit">
            <Text strong>Perihal</Text>
            <Text>{letterDetails?.perihal_surat}</Text>
          </div>
          <div className="flex flex-col items-start gap-1 p-2 rounded-lg w-fit">
            <Text strong>Jumlah Lampiran</Text>
            <Text>
              {letterDetails?.Surat_Masuk?.[0]?.jumlah_lampiran === 0
                ? "Tidak ada"
                : letterDetails?.Surat_Masuk?.[0]?.jumlah_lampiran}
            </Text>
          </div>
        </div>
      </article>
      <article>
        <Divider orientation="center" style={{ marginBottom: "30px" }}>
          Dokumen Preview
        </Divider>
        <iframe
          src={letterDetails?.path_file}
          title="Dokumen Preview"
          width="100%"
          height="700px"
          style={{ border: "none", borderRadius: "8px" }}
        />
      </article>

      {hasUserDisposisi ? (
        // Jika pengguna sudah melakukan disposisi, tampilkan alert
        <Alert
          message="Disposisi Sudah Dilakukan"
          description="Anda sudah melakukan disposisi untuk surat ini. Tidak ada tindakan lebih lanjut yang diperlukan."
          type="info"
          showIcon
          style={{ marginTop: "30px" }}
        />
      ) : (
        <article className="mt-10">
          {lastStatusId === 6 || lastStatusId === 8 ? (
            // Jika status terakhir adalah 6 atau 8, tampilkan alert
            <Alert
              message="Disposisi Selesai"
              description="Disposisi ini telah selesai atau ditolak. Tidak ada tindakan lebih lanjut yang diperlukan."
              type="info"
              showIcon
            />
          ) : !formVisible ? (
            // Jika form belum ditampilkan, tampilkan tombol untuk membuka form
            disposisiData.length === 0 && isRoleDekan ? (
              <Alert
                message="Tindak Lanjut Disposisi"
                description="Klik tombol di bawah untuk menindaklanjuti disposisi ini."
                type="info"
                showIcon
                action={
                  <Button
                    type="primary"
                    style={{ height: "55px" }}
                    onClick={() => setFormVisible(true)}
                  >
                    Tindak Lanjut
                  </Button>
                }
              />
            ) : (
              isUserPenerimaDisposisi && (
                <Alert
                  message="Tindak Lanjut Disposisi"
                  description="Klik tombol di bawah untuk menindaklanjuti disposisi ini."
                  type="info"
                  showIcon
                  action={
                    <Button
                      type="primary"
                      style={{ height: "55px" }}
                      onClick={() => setFormVisible(true)}
                    >
                      Tindak Lanjut
                    </Button>
                  }
                />
              )
            )
          ) : (
            userWithNoJabatan ? (
              <Alert
                message="Tidak Dapat Melakukan Disposisi"
                description="Anda tidak dapat melakukan disposisi karena tidak memiliki jabatan. Silahkan hubungi Koorinator TU untuk mengatur jabatan Anda."
                type="warning"
                showIcon
              />
            ) : (
              <Form
                form={form}
                layout="vertical"
                onFinish={handleCreateDisposisi}
              >
                <Divider orientation="left" style={{ margin: "15px 0px" }}>
                  Tindak Lanjut Disposisi
                </Divider>
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-3">
                  <Form.Item
                    name="id_surat_masuk"
                    initialValue={letterDetails?.Surat_Masuk?.[0]?.id}
                    hidden
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item name="id_pengaju" initialValue={userId} hidden>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="Tujuan Disposisi"
                    name="id_penerima"
                    rules={[
                      {
                        validator: (_, value) => {
                          const idStatusDisposisi = form.getFieldValue("id_status_disposisi");

                          if (!value && idStatusDisposisi !== 6 && idStatusDisposisi !== 8) {
                            return Promise.reject(new Error("Pilih tujuan disposisi!"));
                          }
                          return Promise.resolve();
                        }
                      },
                    ]}
                  >
                    <>
                      <Select
                        placeholder="Pilih Tujuan Disposisi"
                        className="w-full"
                        style={{ height: "40px" }}
                        allowClear
                        onChange={(value) => {
                          form.setFieldsValue({ id_penerima: value }); // Perbarui nilai di form state
                        }}
                        options={userManagementData
                          .filter(
                            (user) =>
                              user.jabatan !== null &&
                              user.jabatan !== undefined &&
                              user.role_id !== 4 &&
                              user.id !== userId
                          )
                          .map((user) => ({
                            label: (
                              <div className="flex items-center gap-2">
                                <div
                                  className="flex items-center justify-center bg-white p-3 rounded-lg shadow-md"
                                  style={{
                                    backgroundColor: getColor(
                                      getInitial(user.nama_lengkap)
                                    ),
                                    width: 25,
                                    height: 25,
                                    borderRadius: "50%",
                                  }}
                                >
                                  <span className="text-white font-bold text-xs">
                                    {getInitial(user.nama_lengkap)}
                                  </span>
                                </div>
                                <span className="font-medium">{`${user.nama_lengkap} - ${user.jabatan}`}</span>
                              </div>
                            ),
                            value: user.id,
                          }))}
                      />
                      {/* Note untuk informasi pencarian */}
                      <div style={{ marginTop: 5, fontSize: "12px", color: "#888" }}>
                        <strong>Catatan:</strong> Anda dapat mengosongkan <em>"Tujuan Surat"</em> apabila status disposisi yang dipilih adalah <strong>"Selesai / Arsipkan"</strong> atau <strong>"Ditolak / Tidak Relevan"</strong>.
                      </div>
                    </>
                  </Form.Item>
                  <Form.Item
                    label="Status Disposisi"
                    name="id_status_disposisi"
                    rules={[
                      { required: true, message: "Pilih status disposisi!" },
                    ]}
                  >
                    <Select
                      placeholder="Pilih Status Disposisi"
                      className="w-full"
                      style={{ height: "40px" }}
                      allowClear
                    >
                      {disposisiStatus
                        .filter((status) => status.id !== 1)
                        .map((status) => (
                          <Option key={status.id} value={status.id}>
                            {status.nama_status}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item
                  label="Pesan Disposisi"
                  name="pesan_disposisi"
                  rules={[
                    { required: true, message: "Masukkan pesan disposisi!" },
                  ]}
                >
                  <TextArea rows={4} placeholder="Masukkan pesan disposisi" />
                </Form.Item>
                <Form.Item className="flex justify-end">
                  <Button type="primary" htmlType="submit">
                    Kirim Disposisi
                  </Button>
                </Form.Item>
              </Form>

            )
          )}
        </article>
      )}

      <Divider orientation="center" style={{ margin: "30px 0px" }}>
        Riwayat Disposisi
      </Divider>

      {disposisiData.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            margin: "20px auto",
          }}
        >
          <Text type="secondary" style={{ textAlign: "center" }}>
            Belum ada disposisi untuk surat ini.
          </Text>
        </div>
      )}
      <div style={{ padding: "0 10px" }}>
        <Timeline
          mode={timelineMode}
          style={{ margin: 0 }}
          items={disposisiData.map((item) => {
            // Fungsi untuk menentukan warna berdasarkan status
            const getStatusColor = (status: unknown) => {
              switch (status) {
                case "Belum Didisposisi":
                  return "gray";
                case "Didisposisikan ke Wakil Dekan":
                case "Didisposisikan ke Ketua Prodi":
                case "Didisposisikan ke TU / Admin":
                  return "blue";
                case "Menunggu Tanggapan Pihak Terkait":
                case "Perlu Tindak Lanjut":
                  return "orange";
                case "Selesai / Arsipkan":
                  return "green";
                case "Ditolak / Tidak Relevan":
                  return "red";
                default:
                  return "blue";
              }
            };

            // Fungsi untuk menentukan tag color Ant Design
            const getTagColor = (status: unknown) => {
              switch (status) {
                case "Selesai / Arsipkan":
                  return "success";
                case "Ditolak / Tidak Relevan":
                  return "error";
                case "Menunggu Tanggapan Pihak Terkait":
                case "Perlu Tindak Lanjut":
                  return "warning";
                default:
                  return "processing";
              }
            };

            return {
              color: getStatusColor(item.status_disposisi?.nama_status),
              dot: (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: getStatusColor(
                      item.status_disposisi?.nama_status
                    ),
                    border: "2px solid white",
                    boxShadow: `0 0 0 2px ${getStatusColor(
                      item.status_disposisi?.nama_status
                    )}`,
                  }}
                />
              ),
              children: (
                <div
                  style={{
                    background: "white",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    marginLeft: "20px",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    transition: "all 0.3s",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{ fontWeight: 500, textTransform: "capitalize" }}
                      >
                        {item.pengaju?.nama_lengkap}
                      </span>
                      <BiArrowFromRight
                        style={{
                          margin: "0 8px",
                          color: "#d9d9d9",
                          fontSize: "16px",
                        }}
                      />
                      <span
                        style={{ fontWeight: 500, textTransform: "capitalize" }}
                      >
                        {item.penerima?.nama_lengkap}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#8c8c8c",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {dayjs(item.tanggal_disposisi).format(
                        "DD MMM YYYY HH:mm"
                      )}
                    </span>
                  </div>

                  <Tag
                    color={getTagColor(item.status_disposisi?.nama_status)}
                    style={{
                      marginTop: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.status_disposisi?.nama_status}
                  </Tag>

                  {item.pesan_disposisi && (
                    <div
                      style={{
                        background: "#f8f9fa",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        fontSize: "13px",
                        color: "#555",
                        borderLeft: "2px solid #e9ecef",
                        marginTop: "8px",
                      }}
                    >
                      {item.pesan_disposisi}
                    </div>
                  )}
                </div>
              ),
            };
          })}
        />
      </div>
    </section>
  );
}
