// Libraries
import { useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";
import { Badge } from "antd";

// Hooks and Store
import useAuthStore from "../../../store/api/useAuthStore";
import useDashboardStore from "../../../store/api/useDashboardStore";
import useClassifierStore from "../../../store/api/useClassifierStore";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import useNotify from "../../../hooks/useNotify";

// Components
import SubHeader from "../headers/SubHeader";
import TableData from "../table/TableData";

// Icons
import {
  TbCircleDashedLetterM,
  TbCircleDashedLetterK,
  TbCircleDashedLetterD,
} from "react-icons/tb";

interface LetterDetails {
  id: string;
  tanggal_terima?: Date | null;
  jumlah_lampiran?: number | null;
  created_at: Date;
  pengarsip: string; // User who archived the letter
  no_surat: string;
  tanggal_surat: Date | null;
  id_type_surat: number;
  perihal_surat: string;
  id_kategori_surat: number;
  id_kriteria_surat: number;
  id_jenis_surat: number;
  pengirim_surat: string;
  penerima_surat: string; // penerima surat (text)
  filename: string;
  path_file: string;
}

export default function DashboardContainer() {
  const hasShownNotification = useRef(false);
  const { notify, contextHolder } = useNotify();
  const { isLoggedIn, clearIsLoggedIn, getUserId, getRole } = useAuthStore();
  const { userMe, fetchUserManagementData, fetchUserManagementDataById } =
    useUserManagementStore();
  const { classifierData, fetchClassifierData } = useClassifierStore();
  const {
    letterData,
    countDataSuratMasuk,
    countDataSuratKeluar,
    countDataDisposisi,
    fetchCountSuratKeluar,
    fetchCountSuratMasuk,
    fetchCountDisposisi,
    fetchLetterData,
  } = useDashboardStore();
  const userId = getUserId();
  const roleId = getRole();

  // show notification when isLoggedIn
  useEffect(() => {
    if (isLoggedIn && !hasShownNotification.current) {
      hasShownNotification.current = true;
      notify({
        type: "success",
        notifyTitle: "Login Success!",
        notifyContent: "You have successfully logged into the system.",
      });

      clearIsLoggedIn();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (userId) {
      fetchCountDisposisi(userId);
    }
  }, [userId, fetchCountDisposisi]);

  useEffect(() => {
    fetchUserManagementData();
    fetchUserManagementDataById();
    fetchCountSuratMasuk();
    fetchCountSuratKeluar();
    fetchLetterData();
    fetchClassifierData();
  }, [
    fetchUserManagementData,
    fetchUserManagementDataById,
    fetchCountSuratMasuk,
    fetchCountSuratKeluar,
    fetchLetterData,
    fetchClassifierData,
  ]);

  const datas = [
    {
      title: "Surat Masuk",
      count: countDataSuratMasuk,
      icon: <TbCircleDashedLetterM size={40} />,
      rolesAllowed: [1, 2, 3, 4, 5],
    },
    {
      title: "Surat Keluar",
      count: countDataSuratKeluar,
      icon: <TbCircleDashedLetterK size={40} />,
      rolesAllowed: [1, 2, 3, 4, 5],
    },
    {
      title: "Surat Disposisi",
      count: countDataDisposisi,
      icon: <TbCircleDashedLetterD size={40} />,
      rolesAllowed: [1, 2, 3, 5],
    },
    {
      title: "Ajuan Penghapusan",
      count: 0,
      icon: <TbCircleDashedLetterD size={40} />,
      rolesAllowed: [1],
    }
  ];

  const processedData = useMemo(() => {
    return letterData.map((item, index) => ({
      ...item,
      key: index,
      no: index + 1,
    }));
  }, [letterData]);

  const columns: ColumnsType<LetterDetails> = useMemo(
    () => [
      {
        title: "No",
        dataIndex: "no",
        key: "no",
        width: 60,
        align: "center",
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
        width: 300,
        render: (text) => (
          <span className="text-ellipsis line-clamp-2">{text}</span>
        ),
      },
      {
        title: "Tanggal Surat",
        dataIndex: "tanggal_surat",
        key: "tanggal_surat",
        width: 200,
        render: (tanggal) =>
          tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",
      },
      {
        title: "Pengirim",
        dataIndex: "pengirim_surat",
        key: "pengirim_surat",
        width: 150,
        render: (text) => (
          <span className="text-ellipsis line-clamp-2">{text}</span>
        ),
      },
      {
        title: "Penerima",
        dataIndex: "penerima_surat",
        key: "penerima_surat",
        width: 150,
        render: (text) => (
          <span className="text-ellipsis line-clamp-2">{text}</span>
        ),
      },
      {
        title: "Jenis Surat",
        dataIndex: "id_type_surat",
        key: "id_type_surat",
        render: (id) => {
          const type = classifierData.find((item) => item.id === id);
          return (
            <Badge
              color={type?.id === 1 ? "blue" : "green"}
              text={type?.nama_type}
              style={{ textTransform: "capitalize" }}
            />
          );
        },
      },
      {
        title: "Pengarsip",
        dataIndex: "pengarsip",
        key: "pengarsip",
      },
      {
        title: "Tanggal Diarsipkan",
        dataIndex: "created_at",
        key: "created_at",
        width: 200,
        render: (tanggal) =>
          tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",
      },
    ],
    [classifierData]
  );

  return (
    <section className="h-full">
      {/* Notify Context */}
      {contextHolder}

      <span className="text-base md:text-lg font-normal">
        Selamat Datang,{" "}
        <span className="font-semibold">{userMe?.nama_lengkap}</span>
      </span>

      <section className="h-auto pb-4 md:pb-0">
        {/* Dashboard View Data Surat */}
        <div
          className={`grid grid-cols-1 gap-4 mt-4 ${roleId === 4 ? "sm:grid-cols-2" : [2, 3, 5].includes(roleId) ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-4"
            }`}
        >
          {datas.map((data, index) => (
            <div
              className={`bg-white shadow-xs h-36 rounded-lg p-5 ${data.rolesAllowed?.includes(roleId) ? "" : "hidden"
                }`}
              key={index}
            >
              <div className="flex flex-col justify-between h-full">
                <span className="font-semibold text-lg md:text-xl">
                  {data.title}
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-4xl md:text-5xl font-bold">
                    {data.count ?? 0}
                  </span>
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    {data.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Surat hari ini */}
        <div className="bg-white w-full h-full flex flex-col p-5 rounded-lg mt-5 flex-grow min-h-0">
          {/* Sub Header */}
          <SubHeader subHeaderTitle="Data Surat Hari Ini" />

          {/* Table Data */}
          <div
            className="overflow-y-hidden flex-grow mt-5 min-h-0"
            style={{
              maxHeight: "calc(100vh - 250px)",
            }}
          >
            <TableData<LetterDetails>
              dataSource={processedData}
              columns={columns}
            />
          </div>
        </div>
      </section>
    </section>
  );
}
