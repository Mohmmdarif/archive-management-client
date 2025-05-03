import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import DetailUser from "../DetailUser";
import { useState } from "react";
import LetterDetailsViewOnly, { LetterDetails } from "../modals/LetterDetailsViewOnly";

type TableDataProps<T> = {
  dataSource: T[];
  columns: ColumnsType<T>;
  showModalOnRowClick?: boolean;
  type?: "userDataDetails" | "suratDataDetails";
};

export default function TableData<T extends object>({
  dataSource,
  columns,
  showModalOnRowClick = false,
  type,
}: TableDataProps<T>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<T | null>(null);
  const [letterData, setLetterData] = useState<T | null>(null);

  const handleRowClick = (record: T) => {
    if (!showModalOnRowClick) return;

    if (type === "userDataDetails") {
      setSelectedUser(record as T);
      setIsModalOpen(true);
    } else if (type === "suratDataDetails") {
      setLetterData(record as T);
      setIsModalOpen(true);
    }
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

      {/* Detail Letter Modal */}
      {letterData && (
        <LetterDetailsViewOnly
          letterDetails={letterData as LetterDetails}
          visible={isModalOpen}
          onClose={() => setLetterData(null)}
        />
      )}
    </>
  );
}
