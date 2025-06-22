import React, { useEffect, useMemo } from 'react'
import useLetterStore from '../../../store/api/useLetterStore'
import { ColumnsType } from 'antd/es/table';
import TableData from '../table/TableData';
import dayjs from 'dayjs';
import useClassifierStore from '../../../store/api/useClassifierStore';
import { Badge, Button } from 'antd';
import { getColorFromNumber } from '../../../libs/utils/randomProfile';
import useCriteriaStore from '../../../store/api/useCriteriaStore';
import { IoEyeOutline } from 'react-icons/io5';
import SubHeader from '../headers/SubHeader';
import useNotify from '../../../hooks/useNotify';
import useAuthStore from '../../../store/api/useAuthStore';

interface LetterDetails {
  id: string;
  no_surat: string;
  id_type_surat: number;
  perihal_surat: string;
  tanggal_surat: string;
  id_jenis_surat: number;
  id_kriteria_surat: number;
  pengirim_surat: string;
  penerima_surat: string;
  status_surat: boolean;
  pengarsip: string;
  filename: string;
  path_file: string;
  created_at: string;
  updated_at: string;
  status_penghapusan_surat: "REQUESTED" | "APPROVED" | "REJECTED";
  alasan_penghapusan_surat: string | null;
  id_user_pengaju_penghapusan: string | null;
  is_deleted: boolean;
}

interface HistoryDeletion {
  id: string;
  id_surat: string;
  id_user: string;
  status: "REQUESTED" | "APPROVED" | "REJECTED";
  alasan: string;
  created_at: Date;
  surat: {
    id: string;
    no_surat: string;
    perihal_surat: string;
    id_kriteria_surat: number;
    tanggal_surat: Date;
    status_penghapusan_surat: "REQUESTED" | "APPROVED" | "REJECTED";
    is_deleted: boolean;
  };
}

export default function RequestApprovalContainer() {
  const { notify, contextHolder } = useNotify();
  const { letterDetails, historyDeletion, fetchSuratData, fetchHistoryDeletion } = useLetterStore();
  const { classifierData, fetchClassifierData } = useClassifierStore();
  const { criteriaData, fetchCriteriaData } = useCriteriaStore();
  const { getRole, getUserId } = useAuthStore();
  const roleId = getRole();
  const userId = getUserId();

  useEffect(() => {
    fetchSuratData();
    fetchClassifierData();
    fetchCriteriaData();
    if (userId) fetchHistoryDeletion(userId);
  }, [fetchSuratData, fetchClassifierData, fetchCriteriaData, fetchHistoryDeletion, userId]);

  const filteredLetterToDelete = (Array.isArray(letterDetails) ? letterDetails : [letterDetails]).filter((letter: LetterDetails) => {
    return letter.status_penghapusan_surat === "REQUESTED" && letter.is_deleted === false;
  });

  const handlePreview = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(path, "_blank");
  };

  const columns: ColumnsType<LetterDetails> = useMemo(
    () => [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 80,
        align: "center",
        render: (_, __, index) => (
          <span>{index + 1}</span>
        ),
      },
      {
        title: "File",
        dataIndex: "path_file",
        key: "path_file",
        align: "center",
        render: (path) => (
          <Button
            type="default"
            size="middle"
            onClick={(e) => handlePreview(path, e)}
          >
            <IoEyeOutline />
            Pratinjau
          </Button>
        ),
      },
      {
        title: "No Surat",
        dataIndex: "no_surat",
        key: "no_surat",
      },
      {
        title: "Perihal",
        dataIndex: "perihal_surat",
        key: "perihal_surat",
        width: 500,
        render: (text) => (
          <span className="text-ellipsis line-clamp-1">{text}</span>
        ),
      },
      {
        title: "Tanggal Surat",
        dataIndex: "tanggal_surat",
        key: "tanggal_surat",
        width: 200,
        sorter: (a, b) => {
          const dateA = dayjs(a.tanggal_surat).unix();
          const dateB = dayjs(b.tanggal_surat).unix();
          return dateA - dateB;
        },
        render: (tanggal) =>
          tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",

        filters: [
          { text: "Hari Ini", value: "today" },
          { text: "Kemarin", value: "yesterday" },
          { text: "7 Hari Terakhir", value: "last7days" },
          { text: "30 Hari Terakhir", value: "last30days" },
          { text: "Bulan Ini", value: "thisMonth" },
          { text: "Bulan Lalu", value: "lastMonth" },
          { text: "Tahun Ini", value: "thisYear" },
          { text: "Tahun Lalu", value: "lastYear" },
        ],

        onFilter: (value, record) => {
          const tanggalRecord = dayjs(record.tanggal_surat).format("YYYY-MM-DD");

          const today = dayjs().format("YYYY-MM-DD");
          const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
          const sevenDaysAgo = dayjs().subtract(7, "day").format("YYYY-MM-DD");
          const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
          const thisMonth = dayjs().format("YYYY-MM");
          const lastMonth = dayjs().subtract(1, "month").format("YYYY-MM");
          const thisYear = dayjs().format("YYYY");
          const lastYear = dayjs().subtract(1, "year").format("YYYY");

          switch (value) {
            case "today":
              return tanggalRecord === today;
            case "yesterday":
              return tanggalRecord === yesterday;
            case "last7days":
              return tanggalRecord >= sevenDaysAgo;
            case "last30days":
              return tanggalRecord >= thirtyDaysAgo;
            case "thisMonth":
              return tanggalRecord.startsWith(thisMonth);
            case "lastMonth":
              return tanggalRecord.startsWith(lastMonth);
            case "thisYear":
              return tanggalRecord.startsWith(thisYear);
            case "lastYear":
              return tanggalRecord.startsWith(lastYear);
            default:
              return false;
          }
        },

        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              const input = document.querySelector(
                ".ant-table-filter-dropdown input"
              ) as HTMLInputElement;
              if (input) {
                input.focus();
              }
            }, 0);
          }
        },
      },
      {
        title: "Pengirim",
        dataIndex: "pengirim_surat",
        key: "pengirim_surat",
        width: 200,
        onFilter: (value, record) => record.pengirim_surat === value,
        render: (text) => <span className="text-ellipsis line-clamp-1">{text}</span>,
      },
      {
        title: "Penerima",
        dataIndex: "penerima_surat",
        key: "penerima_surat",
        width: 200,
        onFilter: (value, record) => record.penerima_surat === value,
        render: (text) => <span className="text-ellipsis line-clamp-1">{text}</span>,
      },
      {
        title: "Jenis Surat",
        dataIndex: "id_type_surat",
        key: "id_type_surat",
        filters:
          classifierData
            .filter(item => item.id !== undefined && item.id !== null)
            .map(item => ({
              text: item.nama_type,
              value: item.id as string | number | boolean,
            })),

        onFilter: (value, record) => record.id_type_surat === value,
        render: (id) => {
          const type = classifierData.find((item) => item.id === id);
          return (
            <Badge
              color={getColorFromNumber(type?.id || 0)}
              text={type?.nama_type}
              style={{ textTransform: "capitalize" }}
            />
          );
        },
      },
      {
        title: "Kriteria Surat",
        dataIndex: "id_kriteria_surat",
        key: "id_kriteria_surat",
        width: 150,
        filterSearch: true,
        filters: criteriaData
          .filter((item) => item.id !== undefined && item.id !== null)
          .map((item) => ({
            text: item.nama_kriteria,
            value: item.id as number,
          })),
        onFilter: (value, record) => record.id_kriteria_surat === value,
        render: (id) => {
          const kriteria = criteriaData.find((item) => item.id === id);
          return (
            <Badge
              color={getColorFromNumber(kriteria?.id || 0)}
              text={kriteria?.nama_kriteria}
              style={{ textTransform: "capitalize" }}
            />
          );
        }
      },
      {
        title: "Pengarsip",
        dataIndex: "pengarsip",
        key: "pengarsip",
        onFilter: (value, record) => record.pengarsip === value,
        render: (text) => <span style={{ textTransform: "capitalize" }}>{text}</span>,
      },
      {
        title: "Tanggal Diarsipkan",
        dataIndex: "created_at",
        key: "created_at",
        width: 200,
        render: (tanggal) =>
          tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",
        sorter: (a, b) => {
          const dateA = dayjs(a.created_at).unix();
          const dateB = dayjs(b.created_at).unix();
          return dateA - dateB;
        },
        filters: [
          { text: "Hari Ini", value: "today" },
          { text: "Kemarin", value: "yesterday" },
          { text: "7 Hari Terakhir", value: "last7days" },
          { text: "30 Hari Terakhir", value: "last30days" },
          { text: "Bulan Ini", value: "thisMonth" },
          { text: "Bulan Lalu", value: "lastMonth" },
          { text: "Tahun Ini", value: "thisYear" },
          { text: "Tahun Lalu", value: "lastYear" },
        ],
        onFilter: (value, record) => {
          const tanggalRecord = dayjs(record.created_at).format("YYYY-MM-DD");

          const today = dayjs().format("YYYY-MM-DD");
          const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");
          const sevenDaysAgo = dayjs().subtract(7, "day").format("YYYY-MM-DD");
          const thirtyDaysAgo = dayjs().subtract(30, "day").format("YYYY-MM-DD");
          const thisMonth = dayjs().format("YYYY-MM");
          const lastMonth = dayjs().subtract(1, "month").format("YYYY-MM");
          const thisYear = dayjs().format("YYYY");
          const lastYear = dayjs().subtract(1, "year").format("YYYY");

          switch (value) {
            case "today":
              return tanggalRecord === today;
            case "yesterday":
              return tanggalRecord === yesterday;
            case "last7days":
              return tanggalRecord >= sevenDaysAgo;
            case "last30days":
              return tanggalRecord >= thirtyDaysAgo;
            case "thisMonth":
              return tanggalRecord.startsWith(thisMonth);
            case "lastMonth":
              return tanggalRecord.startsWith(lastMonth);
            case "thisYear":
              return tanggalRecord.startsWith(thisYear);
            case "lastYear":
              return tanggalRecord.startsWith(lastYear);
            default:
              return false;
          }
        },
        onFilterDropdownOpenChange: (visible) => {
          if (visible) {
            setTimeout(() => {
              const input = document.querySelector(
                ".ant-table-filter-dropdown input"
              ) as HTMLInputElement;
              if (input) {
                input.focus();
              }
            }, 0);
          }
        },

      },
    ],
    [classifierData]
  );

  const historyColumns: ColumnsType<HistoryDeletion> = useMemo(() => [
    {
      title: "No",
      render: (_, __, index) => index + 1,
      width: 60,
      align: "center",
    },
    {
      title: "Tanggal Pengajuan",
      dataIndex: "created_at",
      width: 170,
      align: "center",
      render: (date) => dayjs(date).format("DD MMM YYYY HH:mm"),
    },
    {
      title: "No Surat",
      dataIndex: ["surat", "no_surat"],
    },
    {
      title: "Perihal",
      dataIndex: ["surat", "perihal_surat"],
      width: 400,
      render: (text) => <span className="text-ellipsis line-clamp-2">{text}</span>,
    },
    {
      title: "Kriteria Surat",
      dataIndex: ["surat", "id_kriteria_surat"],
      width: 150,
      filterSearch: true,
      filters: criteriaData
        .filter((item) => item.id !== undefined && item.id !== null)
        .map((item) => ({
          text: item.nama_kriteria,
          value: item.id as number,
        })),
      onFilter: (value, record) => record?.surat?.id_kriteria_surat === value,
      render: (id) => {
        const kriteria = criteriaData?.find((item) => item.id === id);
        return (
          <Badge
            color={getColorFromNumber(kriteria?.id || 0)}
            text={kriteria?.nama_kriteria}
            style={{ textTransform: "capitalize" }}
          />
        );
      }
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        { text: "Diajukan", value: "REQUESTED" },
        { text: "Disetujui", value: "APPROVED" },
        { text: "Ditolak", value: "REJECTED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const color = status === "APPROVED" ? "green" : status === "REJECTED" ? "red" : "blue";
        return <Badge color={color} text={status} />;
      }
    },
    {
      title: "Alasan",
      dataIndex: "alasan",
      width: 400,
      render: (text) => <span className="text-ellipsis line-clamp-2">{text}</span>,
    },

  ], [criteriaData]);


  return (
    <section className="bg-white w-full h-full flex flex-col p-5 rounded-lg relative">
      {/* Notify Context */}
      {contextHolder}

      {/* Sub Header */}
      <SubHeader subHeaderTitle={roleId === 1
        ? "List Pengajuan Penghapusan"
        : "Riwayat Pengajuan Penghapusan"}
      />

      {/* Table Data */}
      <div
        className="overflow-y-auto flex-grow"
        style={{
          maxHeight: "calc(100vh - 250px)",
        }}
      >
        {roleId === 1 ? (
          <TableData<LetterDetails>
            dataSource={filteredLetterToDelete || []}
            columns={columns}
            showModalOnRowClick
            type="requestApprovalDetails"
            notifyFunction={notify}
          />
        ) : (
          <TableData<HistoryDeletion>
            dataSource={historyDeletion || []}
            columns={historyColumns}
            showModalOnRowClick={false}
            notifyFunction={notify}
          />
        )}
      </div>
    </section>
  )
}

