// Libraries
import { useEffect, useState } from "react";
import { Flex, Modal, Space } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/lib/table";

// Hooks and Store
import useAuthStore from "../../../store/api/useAuthStore";
import useSearchStore from "../../../store/useSearch";
import useModalStore from "../../../store/useModal";
import useCriteriaStore from "../../../store/api/useCriteriaStore";
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

interface CriteriaData {
  key: React.Key;
  id: number;
  nama_kriteria: string;
  keterangan: string;
}

export default function CriteriaContainer() {
  const [form] = useForm();
  const { notify, contextHolder } = useNotify();
  const { searchQuery } = useSearchStore();
  const { criteriaData, fetchCriteriaData, addData, updateData, deleteData } =
    useCriteriaStore();
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const [editingData, setEditingData] = useState<CriteriaData | null>(null);
  const getRole = useAuthStore((state) => state.getRole);
  const roleId = getRole();

  useEffect(() => {
    fetchCriteriaData();
  }, [fetchCriteriaData]);

  const criteria = transformData(criteriaData);

  const filteredData = filterData(criteria, searchQuery, ["nama_kriteria"]);

  const handleOk = () => form.submit();

  const handleAdd = () => {
    setEditingData(null);
    form.resetFields();
    openModal();
  };

  const handleEdit = (record: CriteriaData) => {
    setEditingData(record);
    form.setFieldsValue(record);
    openModal();
  };

  const handleSubmit = async (values: Omit<CriteriaData, "id">) => {
    if (editingData) {
      await updateData(editingData.id, values);

      notify({
        type: "success",
        notifyTitle: "Success!",
        notifyContent: "Data has been successfully updated.",
      });
    } else {
      await addData(values);
      await fetchCriteriaData();

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
      title: "Delete Letter Criteria",
      content: "Are you sure you want to delete this criteria?",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          await deleteData(id);
          await fetchCriteriaData();

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

  const columns: ColumnsType<CriteriaData> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 70,
    },
    {
      title: "Nama Kriteria",
      dataIndex: "nama_kriteria",
      key: "nama_kriteria",
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
    });
  }

  return (
    <section className="bg-white w-full h-full p-5 rounded-lg">
      {/* Notify Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle="Kriteria Surat" />

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
        <TableData<CriteriaData>
          key={criteriaData.length}
          dataSource={(filteredData as CriteriaData[]) || []}
          columns={columns}
        />
      </div>


      {/* Modal Form */}
      <DefaultModal
        modalTitle={
          editingData ? "Edit Kriteria Surat" : "Tambah Kriteria Surat"
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
          nameFieldLabel="Nama Kriteria"
          nameFieldName="nama_kriteria"
          descriptionFieldLabel="Keterangan"
          descriptionFieldName="keterangan"
          namePlaceholder="Permohonan, Edaran ..."
          descriptionPlaceholder="Kriteria surat untuk ..."
          onSubmit={handleSubmit}
          form={form}
        />
      </DefaultModal>
    </section>
  );
}
