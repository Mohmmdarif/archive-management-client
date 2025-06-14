// Libraries
import { useEffect, useState } from "react";
import { Flex, Modal, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/lib/table";

// Hooks and Store
import useAuthStore from "../../../store/api/useAuthStore";
import useSearchStore from "../../../store/useSearch";
import useModalStore from "../../../store/useModal";
import useTypeStore from "../../../store/api/useTypeStore";
import useNotify from "../../../hooks/useNotify";
import { transformData } from "../../../libs/utils/transformData";
import { filterData } from "../../../libs/utils/filterData";
import { getErrorMessage } from "../../../libs/utils/errorHandler";

// Components
import TableData from "../table/TableData";
import ButtonIcon from "../buttons/ButtonIcon";
import MasterDataForm from "../forms/MasterDataForm";
import SubHeader from "../headers/SubHeader";
import Search from "../search/Search";
import DefaultModal from "../modals/DefaultModal";

// Icons
import { BiEdit, BiPlus } from "react-icons/bi";
import { TbTrash } from "react-icons/tb";

interface TypeData {
  key: React.Key;
  id: number;
  nama_jenis: string;
  keterangan: string;
}

export default function TypeContainer() {
  const [form] = useForm();
  const { notify, contextHolder } = useNotify();
  const { searchQuery } = useSearchStore();
  const { typeData, addData, updateData, deleteData, fetchTypeData } =
    useTypeStore();
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const [editingData, setEditingData] = useState<TypeData | null>(null);
  const getRole = useAuthStore((state) => state.getRole);
  const roleId = getRole();

  useEffect(() => {
    fetchTypeData();
  }, [fetchTypeData]);

  const type = transformData(typeData);

  const filteredData = filterData(type, searchQuery, ["nama_jenis"]);

  const handleOk = () => form.submit();

  const handleAdd = () => {
    setEditingData(null);
    form.resetFields();
    openModal();
  };

  const handleEdit = (record: TypeData) => {
    setEditingData(record);
    form.setFieldsValue(record);
    openModal();
  };

  const handleSubmit = async (values: Omit<TypeData, "id">) => {
    if (editingData) {
      await updateData(editingData.id, values);

      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Data has been successfully updated.",
      });
    } else {
      await addData(values);
      await fetchTypeData();

      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Data has been successfully added.",
      });
    }
    closeModal();
    setEditingData(null);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Hapus Jenis Surat",
      content: "Are you sure you want to delete this type?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteData(id);
          await fetchTypeData();

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

  const columns: ColumnsType<TypeData> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 70,
    },
    {
      title: "Nama Jenis",
      dataIndex: "nama_jenis",
      key: "nama_jenis",
      sortDirections: ["ascend"],
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
    },
  ];

  if (![2, 3, 4].includes(roleId)) {
    columns.push({
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Space size="small">
            <ButtonIcon
              shape="circle"
              tooltipTitle="Edit"
              icon={<BiEdit />}
              onClick={() => handleEdit(record)}
            />
            <ButtonIcon
              shape="circle"
              tooltipTitle="Delete"
              icon={<TbTrash />}
              onClick={() => handleDelete(record.id)}
            />
          </Space>
        );
      },
    },
    );
  }

  return (
    <section className="bg-white w-full h-full p-5 rounded-lg">
      {/* Notify Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Jenis Surat" />

      {/* Search and Button Add */}
      <Flex
        justify="space-between"
        align="center"
        style={{ marginBottom: 20, marginTop: 20 }}
        gap={10}
      >
        <Search />

        {
          roleId === 1 ? (
            <ButtonIcon
              type="primary"
              icon={<BiPlus />}
              onClick={handleAdd}
              size="middle"
              shape="default"
            >
              Tambah
            </ButtonIcon>
          ) : null
        }
      </Flex>

      {/* Table Data */}
      <div className="overflow-y-auto max-h-full" style={{
        maxHeight: "calc(100vh - 250px)",
      }}>
        <TableData<TypeData>
          key={typeData.length}
          dataSource={(filteredData as TypeData[]) || []}
          columns={columns}
        />
      </div>

      {/* Modal Form */}
      <DefaultModal
        modalTitle={editingData ? "Edit Jenis Surat" : "Tambah Jenis Surat"}
        isOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={() => {
          closeModal();
          setEditingData(null);
        }}
      >
        <MasterDataForm
          key={editingData ? editingData.id : "add"}
          nameFieldLabel="Nama Jenis"
          nameFieldName="nama_jenis"
          descriptionFieldLabel="Keterangan"
          descriptionFieldName="keterangan"
          namePlaceholder="Biasa, ..."
          descriptionPlaceholder="Jenis surat yang diperuntukkan untuk ..."
          onSubmit={handleSubmit}
          form={form}
        />
      </DefaultModal>
    </section>
  );
}
