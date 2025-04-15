import { Badge, Flex, message, Modal, Space, Tag } from "antd";

import TableData from "../table/TableData";
import ButtonIcon from "../buttons/ButtonIcon";

import { BiEdit, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";
import { ColumnsType } from "antd/es/table";
import SubHeader from "../headers/SubHeader";
import Search from "../search/Search";
import DefaultModal from "../modals/DefaultModal";
import useModalStore from "../../../store/useModal";
import { useEffect, useState } from "react";
import UserManagementForm from "../forms/UserManagementForm";
import { useForm } from "antd/es/form/Form";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import { transformData } from "../../../libs/utils/transformData";
import { filterData } from "../../../libs/utils/filterData";
import useSearchStore from "../../../store/useSearch";
import { getRole } from "../../../libs/utils/getRole";
import useNotify from "../../../hooks/useNotify";
import { getErrorMessage } from "../../../libs/utils/errorHandler";

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
  const {
    userManagementData,
    fetchUserManagementData,
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
        ({ getFieldValue }: { getFieldValue: (field: string) => any }) => ({
          validator(_: any, value: any) {
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
      fieldType: "text" as const,
      placeholder: "Jabatan",
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
      ],
    },
  ];

  const columns: ColumnsType<UserData> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
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
      render: (record) => record || "-",
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
        notifyTitle: "Berhasil",
        notifyContent: "Data berhasil ditambahkan.",
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
      notify({
        type: "success",
        notifyTitle: "Berhasil",
        notifyContent: "Data berhasil diperbarui.",
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
      content: "Apakah anda yakin ingin menghapus user ini?",
      okText: "Hapus",
      cancelText: "Batal",
      onOk: async () => {
        try {
          await deleteData(id);

          // Show notification
          notify({
            type: "success",
            notifyTitle: "Berhasil!",
            notifyContent: "Data berhasil dihapus.",
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

  return (
    <section className="bg-white w-full h-full p-5 rounded-lg overflow-x-auto">
      {/* Notification Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Data Pengguna" />

      {/* Search and Button Add */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: 20, marginTop: 20 }}
        gap={10}
      >
        <Search />

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

      <TableData
        dataSource={(filteredData as UserData[]) || []}
        columns={columns}
        showModalOnRowClick
      />

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
