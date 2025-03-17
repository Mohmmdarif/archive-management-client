// Libraries
import { useEffect, useState } from "react";
import { Flex, Modal, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/lib/table";

// Hooks and Store
import useSearchStore from "../../../store/useSearch";
import useModalStore from "../../../store/useModal";
import useCategoryStore from "../../../store/api/useCategoryStore";
import useNotify from "../../../hooks/useNotify";
import { transformData } from "../../../libs/utils/transformData";
import { filterData } from "../../../libs/utils/filterData";

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

interface CategoryData {
  key: React.Key;
  id: number;
  nama_kategori: string;
  keterangan: string;
}

export default function CategoryContainer() {
  const [form] = useForm();
  const { notify, contextHolder } = useNotify();
  const { searchQuery } = useSearchStore();
  const { categoryData, fetchCategoryData, addData, updateData, deleteData } =
    useCategoryStore();
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const [editingData, setEditingData] = useState<CategoryData | null>(null);

  useEffect(() => {
    fetchCategoryData();
  }, [fetchCategoryData]);

  const category = transformData(categoryData);

  const filteredData = filterData(category, searchQuery, ["nama_kategori"]);

  const handleOk = () => form.submit();

  const handleAdd = () => {
    setEditingData(null);
    form.resetFields();
    openModal();
  };

  const handleEdit = (record: CategoryData) => {
    setEditingData(record);
    form.setFieldsValue(record);
    openModal();
  };

  const handleSubmit = async (values: Omit<CategoryData, "id">) => {
    if (editingData) {
      await updateData(editingData.id, values);

      notify({
        type: "success",
        notifyTitle: "Berhasil",
        notifyContent: "Data berhasil diperbarui.",
      });
    } else {
      await addData(values);
      await fetchCategoryData();

      notify({
        type: "success",
        notifyTitle: "Berhasil",
        notifyContent: "Data berhasil ditambahkan.",
      });
    }
    closeModal();
    setEditingData(null);
    form.resetFields();
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Hapus Kategori Surat",
      content: "Apakah anda yakin ingin menghapus kategori surat ini?",
      okText: "Hapus",
      cancelText: "Batal",
      onOk: async () => {
        try {
          await deleteData(id);
          await fetchCategoryData();

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

  const columns: ColumnsType<CategoryData> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
    },
    {
      title: "Nama Kategori",
      dataIndex: "nama_kategori",
      key: "nama_kategori",
      sortDirections: ["ascend"],
    },
    {
      title: "Keterangan",
      dataIndex: "keterangan",
      key: "keterangan",
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
  ];

  return (
    <section className="bg-white w-full h-full p-5 rounded-lg overflow-x-auto">
      {/* Notify Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Kategori Surat" />

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

      {/* Table Data */}
      <TableData
        key={categoryData.length}
        dataSource={(filteredData as CategoryData[]) || []}
        columns={columns}
      />

      {/* Modal Form */}
      <DefaultModal
        modalTitle={
          editingData ? "Edit Kategori Surat" : "Tambah Kategori Surat"
        }
        isOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={() => {
          closeModal();
          setEditingData(null);
        }}
      >
        <MasterDataForm
          key={editingData ? editingData.id : "add"}
          nameFieldLabel="Nama Kategori"
          nameFieldName="nama_kategori"
          descriptionFieldLabel="Keterangan"
          descriptionFieldName="keterangan"
          namePlaceholder="Akademik, ..."
          descriptionPlaceholder="Kategori surat yang diperuntukkan untuk ..."
          onSubmit={handleSubmit}
          form={form}
        />
      </DefaultModal>
    </section>
  );
}
