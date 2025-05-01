import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import DetailUser from "../DetailUser";
import { useState } from "react";

type TableDataProps<T> = {
  dataSource: T[];
  columns: ColumnsType<T>;
  showModalOnRowClick?: boolean;
};

export default function TableData<T extends object>({
  dataSource,
  columns,
  showModalOnRowClick = false,
}: TableDataProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<T | null>(null);

  const handleRowClick = (record: T) => {
    if (!showModalOnRowClick) return;
    setSelectedUser(record);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Table Data */}
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
        pagination={
          dataSource.length >= 10
            ? { pageSize: 10, position: ["bottomRight"], showSizeChanger: false, responsive: true }
            : { showSizeChanger: false, responsive: true }
        }
        onRow={(record) => {
          return {
            onClick: () => handleRowClick(record),
            style: { cursor: "pointer" },
          };
        }}
      />

      {/* Detail User Modal */}
      {selectedUser && (
        <DetailUser
          userData={selectedUser}
          visible={isModalOpen}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </>
  );
}
