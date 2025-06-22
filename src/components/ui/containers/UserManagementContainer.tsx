// Libraries
import { useEffect, useState } from "react";
import { Alert, Badge, Flex, Modal, Space, Tag } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";

// Hooks and Store
import useAuthStore from "../../../store/api/useAuthStore";
import useModalStore from "../../../store/useModal";
import UserManagementForm from "../forms/UserManagementForm";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import useSearchStore from "../../../store/useSearch";
import useNotify from "../../../hooks/useNotify";
import { transformData } from "../../../libs/utils/transformData";
import { filterData } from "../../../libs/utils/filterData";
import { getJabatan, getRole } from "../../../libs/utils/getRole";
import { getErrorMessage } from "../../../libs/utils/errorHandler";

// Components
import Search from "../search/Search";
import SubHeader from "../headers/SubHeader";
import TableData from "../table/TableData";
import ButtonIcon from "../buttons/ButtonIcon";
import DefaultModal from "../modals/DefaultModal";

// Icons
import { BiEdit, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

interface UserData {
  key: React.Key;
  id: string;
  no: number;
  nip: string;
  gambar_profil: string | null;
  id_jenis_kelamin: number;
  nama_lengkap: string;
  email: string;
  role_id: number;
  jabatan: string;
  no_telp: string;
  status_aktif: boolean;
  created_at: string;
  updated_at: string;
}

export default function UserManagementContainer() {
  const [form] = useForm();
  const { notify, contextHolder } = useNotify();
  const { searchQuery } = useSearchStore();
  const { isModalOpen, openModal, closeModal } = useModalStore();
  const { getRole: currentUserRoleId } = useAuthStore();
  const roleId = currentUserRoleId();
  const {
    userManagementData,
    fetchUserManagementData,
    fetchUserManagementDataById,
    addData,
    updateData,
    deleteData,
    error,
    clearError,
  } = useUserManagementStore();
  const [editingData, setEditingData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserManagementData();
  }, [fetchUserManagementData]);

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
      clearError();
    }
  }, [error, clearError]);

  const users = transformData(userManagementData);

  // Filter pengguna tanpa jabatan
  const usersWithoutJabatan = users.filter((user) => !user.jabatan);

  const filteredData = filterData(users, searchQuery, ["nip", "nama_lengkap"]);

  const formInput = [
    {
      fieldLabel: "Nama Lengkap",
      fieldName: "nama_lengkap",
      fieldType: "text" as const,
      placeholder: "John Doe",
    },
    {
      fieldLabel: "Email",
      fieldName: "email",
      fieldType: "text" as const,
      placeholder: "johndoe@mail.com",
    },
    {
      fieldLabel: "NIP",
      fieldName: "nip",
      fieldType: "text" as const,
      placeholder: "09543453883",
    },
    {
      fieldLabel: "Kata Sandi",
      fieldName: "password",
      fieldType: "password" as const,
      placeholder: "*******",
      rules: [
        { required: true, message: "Kata sandi harus diisi!" },
        { min: 8, message: "Kata sandi minimal 8 karakter!" },
      ],
    },
    {
      fieldLabel: "Konfirmasi Kata Sandi",
      fieldName: "confirmPassword",
      fieldType: "password" as const,
      placeholder: "*******",
      rules: [
        { required: true, message: "Konfirmasi kata sandi harus diisi!" },
        ({ getFieldValue }: { getFieldValue: (field: string) => string }) => ({
          validator(_: unknown, value: string) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("Kata sandi tidak sesuai!"));
          },
        }),
      ],
    },
    {
      fieldLabel: "Jenis Kelamin",
      fieldName: "id_jenis_kelamin",
      fieldType: "select" as const,
      placeholder: "Pilih Jenis Kelamin",
      options: [
        { label: "Pria", value: 1 },
        { label: "Wanita", value: 2 },
      ],
    },
    {
      fieldLabel: "Role",
      fieldName: "role_id",
      fieldType: "select" as const,
      placeholder: "Pilih Role",
      options: [
        { label: "Koordinator TU", value: 1 },
        { label: "Pimpinan", value: 2 },
        { label: "Arsiparis Surat Masuk", value: 3 },
        { label: "Arsiparis Surat Keluar", value: 4 },
        { label: "User General", value: 5 },
      ],
    },
  ];

  const formInputEdit = [
    {
      fieldLabel: "Nama Lengkap",
      fieldName: "nama_lengkap",
      fieldType: "text" as const,
      placeholder: "John Doe",
    },
    {
      fieldLabel: "Email",
      fieldName: "email",
      fieldType: "text" as const,
      placeholder: "johndoe@mail.com",
      disable: true,
    },
    {
      fieldLabel: "NIP",
      fieldName: "nip",
      fieldType: "text" as const,
      placeholder: "09543453883",
    },
    {
      fieldLabel: "No. Telp",
      fieldName: "no_telp",
      fieldType: "text" as const,
      placeholder: "0857xxxxxx",
    },
    {
      fieldLabel: "Jabatan",
      fieldName: "jabatan",
      fieldType: "select" as const,
      placeholder: "Pilih Jabatan",
      options: [
        { label: "Koordinator TU", value: "koordinator_tu" },
        { label: "Dekan", value: "dekan" },
        { label: "Wakil Dekan I", value: "wakil_dekan_1" },
        { label: "Wakil Dekan II", value: "wakil_dekan_2" },
        { label: "Wakil Dekan III", value: "wakil_dekan_3" },
        { label: "Kaprodi", value: "kaprodi" },
        { label: "Arsiparis Surat Masuk", value: "arsiparis_surat_masuk" },
        { label: "Arsiparis Surat Keluar", value: "arsiparis_surat_keluar" },
        { label: "Staff", value: "staff" },
      ],
    },
    {
      fieldLabel: "Jenis Kelamin",
      fieldName: "id_jenis_kelamin",
      fieldType: "select" as const,
      placeholder: "Pilih Jenis Kelamin",
      options: [
        { label: "Pria", value: 1 },
        { label: "Wanita", value: 2 },
      ],
    },
    {
      fieldLabel: "Role",
      fieldName: "role_id",
      fieldType: "select" as const,
      placeholder: "Pilih Role",
      options: [
        { label: "Koordinator TU", value: 1 },
        { label: "Pimpinan", value: 2 },
        { label: "Arsiparis Surat Masuk", value: 3 },
        { label: "Arsiparis Surat Keluar", value: 4 },
        { label: "User General", value: 5 },
      ],
    },
  ];

  const columns: ColumnsType<UserData> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      width: 60,
      align: "center",
    },
    {
      title: "NIP",
      dataIndex: "nip",
      key: "nip",
      render: (record) => record || "-",
    },
    {
      title: "Nama Lengkap",
      dataIndex: "nama_lengkap",
      key: "nama_lengkap",
      render: (record) => record || "-",
    },
    {
      title: "Jabatan",
      dataIndex: "jabatan",
      key: "jabatan",
      render: (record) => getJabatan(record) || "-",
    },
    {
      title: "Role",
      dataIndex: "role_id",
      key: "role_id",
      render: (record) => {
        return (
          <Tag
            color="blue"
            style={{
              padding: "5px 20px",
              borderRadius: 20,
              fontSize: 14,
              width: "200px",
            }}
          >
            {getRole(record)}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: () => {
        return <Badge status="success" text="Aktif" />;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Space size="small">
            <ButtonIcon
              tooltipTitle="Edit"
              icon={<BiEdit />}
              shape="circle"
              size="middle"
              onClick={(e) => handleEdit(e, record)}
            />
            <ButtonIcon
              tooltipTitle="Delete"
              icon={<TbTrash />}
              shape="circle"
              size="middle"
              onClick={(e) => handleDelete(e, record.id)}
            />
          </Space>
        );
      },
    },
  ];

  const handleOk = () => form.submit();

  const handleAdd = () => {
    setEditingData(null);
    form.resetFields();
    openModal();
  };

  const handleEdit = (e: React.MouseEvent, record: UserData) => {
    e.stopPropagation();

    setEditingData(record);
    form.setFieldsValue(record);
    openModal();
  };

  const handleSubmitAdd = async (values: Omit<UserData, "id">) => {
    try {
      await addData(values);

      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Data has been successfully added.",
      });
    } catch (error) {
      notify({
        type: "error",
        notifyTitle: "Error!",
        notifyContent: getErrorMessage(error as Error),
      });
    } finally {
      closeModal();
      form.resetFields();
    }
  };

  // fungsi submit untuk edit user
  const handleSubmitEdit = async (values: Omit<UserData, "id">) => {
    try {
      if (editingData) {
        await updateData(editingData.id, values);
      }
      await fetchUserManagementDataById();
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
      closeModal();
      setEditingData(null);
      form.resetFields();
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Hapus User",
      content: "Are you sure you want to delete this user?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteData(id);

          // Show notification
          notify({
            type: "success",
            notifyTitle: "Success!",
            notifyContent: "Data has been successfully deleted.",
          });
        } catch (error) {
          notify({
            type: "error",
            notifyTitle: "Error!",
            notifyContent: getErrorMessage(error as Error),
          });
        }
      },
    });
  };

  return (
    <section className="bg-white w-full h-full flex flex-col p-5 rounded-lg">
      {/* Notification Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Data Pengguna" />

      {/* Alert jika ada pengguna tanpa jabatan */}
      {usersWithoutJabatan.length > 0 && roleId === 1 && (
        <Alert
          message="Perhatian"
          description="Koordinator TU wajib mengisikan field jabatan untuk pengguna agar dapat melakukan disposisi ke user tersebut!."
          type="warning"
          showIcon
          style={{ marginBottom: 15 }}
          closable
        />
      )}

      {/* Search and Button Add */}
      <Flex
        justify="space-between"
        align="start"
        style={{ marginBottom: 15, marginTop: 15 }}
        gap={10}
      >
        <Search>
          <strong>Catatan:</strong> Anda dapat mencari berdasarkan <em>"NIP"</em> dan <em>"Nama Lengkap".</em>
        </Search>

        <ButtonIcon
          type="primary"
          icon={<BiPlus />}
          onClick={handleAdd}
          size="middle"
          shape="default"
        >
          Tambah
        </ButtonIcon>
      </Flex>

      <div className="overflow-y-auto flex-grow" style={{
        maxHeight: "calc(100vh - 250px)",
      }}>
        <TableData<UserData>
          dataSource={(filteredData as UserData[]) || []}
          columns={columns}
          showModalOnRowClick
          type="userDataDetails"
        />
      </div>

      {/* Modal Form */}
      <DefaultModal
        modalTitle={editingData ? "Edit User Data" : "Tambah User Data"}
        isOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={() => {
          setEditingData(null);
          closeModal();
        }}
      >
        {editingData ? (
          <UserManagementForm
            key="edit-form"
            formInput={formInputEdit}
            form={form}
            onSubmit={handleSubmitEdit}
          />
        ) : (
          <UserManagementForm
            key="add-form"
            formInput={formInput}
            form={form}
            onSubmit={handleSubmitAdd}
          />
        )}
      </DefaultModal>
    </section>
  );
}
