import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";

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
  return (
    <>
      {/* Table Data */}
      <Table
        dataSource={dataSource}
        columns={columns}
        scroll={{ x: "max-content" }}
        pagination={
          dataSource.length > 10
            ? { pageSize: 10, position: ["bottomCenter"] }
            : false
        }
        onRow={(record) => {
          return {
            onClick: () => {
              if (showModalOnRowClick) console.log(record);
            },
            style: { cursor: "pointer" },
          };
        }}
      />
    </>
  );
}
