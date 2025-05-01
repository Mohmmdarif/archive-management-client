import React, { useEffect, useRef } from "react";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import useAuthStore from "../../../store/api/useAuthStore";
import useNotify from "../../../hooks/useNotify";
import { TbCircleDashedLetterM, TbCircleDashedLetterK, TbCircleDashedLetterD, TbTrash } from "react-icons/tb";
import SubHeader from "../headers/SubHeader";
import Search from "../search/Search";
import TableData from "../table/TableData";
import { ColumnsType } from "antd/es/table";
import { Badge, Space } from "antd";
import ButtonIcon from "../buttons/ButtonIcon";
import { BiEdit } from "react-icons/bi";


export default function DashboardContainer() {
  const hasShownNotification = useRef(false);
  const { notify, contextHolder } = useNotify();
  const { isLoggedIn, clearIsLoggedIn } = useAuthStore();
  const { userMe, fetchUserManagementDataById } = useUserManagementStore();

  // show notification when isLoggedIn
  useEffect(() => {
    if (isLoggedIn && !hasShownNotification.current) {
      hasShownNotification.current = true;
      notify({
        type: "success",
        notifyTitle: "Login success",
        notifyContent: "You have successfully logged in.",
      });

      clearIsLoggedIn();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchUserManagementDataById();
  }, [fetchUserManagementDataById]);

  const datas = [
    {
      title: "Surat Masuk",
      count: 100,
      icon: <TbCircleDashedLetterM size={60} />,
    },
    {
      title: "Surat Keluar",
      count: 50,
      icon: <TbCircleDashedLetterK size={60} />,
    },
    {
      title: "Surat Disposisi",
      count: 20,
      icon: <TbCircleDashedLetterD size={60} />,
    }
  ];

  interface SuratData {
    key: React.Key;
    no: number;
    noSurat: string;
    tanggalSurat: string;
    pengirim: string;
    perihal: string;
    tipeSurat: string;
    status: string;
  }

  const dataSource: SuratData[] = [
    {
      key: "1",
      no: 1,
      noSurat: "001/UN7.7/PP/2021",
      tanggalSurat: "2021-08-03",
      pengirim: "Dekan FIK",
      perihal: "Pengajuan Proposal PKM",
      tipeSurat: "Surat Masuk",
      status: "Diterima",
    },
    {
      key: "1",
      no: 1,
      noSurat: "001/UN7.7/PP/2021",
      tanggalSurat: "2021-08-03",
      pengirim: "Dekan FIK",
      perihal: "Pengajuan Proposal PKM",
      tipeSurat: "Surat Masuk",
      status: "Diterima",
    },

  ];

  const columns: ColumnsType<SuratData> = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "No Surat",
      dataIndex: "noSurat",
      key: "noSurat",
    },
    {
      title: "Tanggal Surat",
      dataIndex: "tanggalSurat",
      key: "tanggalSurat",
    },
    {
      title: "Pengirim",
      dataIndex: "pengirim",
      key: "pengirim",
    },
    {
      title: "Perihal",
      dataIndex: "perihal",
      key: "perihal",
    },
    {
      title: "Tipe Surat",
      dataIndex: "tipeSurat",
      key: "tipeSurat",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: () => {
        return <Badge status="success" text="Diterima" />;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: () => {
        return (
          <Space size="small">
            <ButtonIcon
              tooltipTitle="Edit"
              icon={<BiEdit />}
              onClick={() => console.log("Edit")}
            />
            <ButtonIcon
              tooltipTitle="Delete"
              icon={<TbTrash />}
              onClick={() => console.log("Delete")}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <section className="h-full">
      {/* Notify Context */}
      {contextHolder}

      <span className="text-base md:text-lg font-normal">
        Selamat Datang,{" "}
        <span className="font-semibold">{userMe?.nama_lengkap}</span>
      </span>

      <section className="h-full">
        {/* Dashboard View Data Surat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {datas.map((data, index) => (
            <div className="bg-white shadow-xs h-36 rounded-lg p-5" key={index}>
              <div className="flex flex-col justify-between h-full">
                <span className="font-semibold text-lg md:text-xl">{data.title}</span>
                <div className="flex items-center justify-between">
                  <span className="text-4xl md:text-5xl font-bold">{data.count}</span>
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    {data.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Data Surat hari ini */}
        <div className="bg-white w-full h-full mt-5 p-5 rounded-lg">

          {/* Sub Header */}
          <SubHeader subHeaderTitle="Data Surat Hari Ini" />

          {/* Search */}
          <Search />

          {/* Table Data */}
          <div className="mt-5">
            <TableData dataSource={dataSource} columns={columns} />
          </div>
        </div>
      </section>
    </section>
  );
}
