// Libraries
import { useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router';
import dayjs from 'dayjs';
import { Badge, Space } from 'antd';
import { ColumnsType } from 'antd/es/table';

// Hooks and Store
import useAuthStore from '../../../store/api/useAuthStore';
import useLetterStore from '../../../store/api/useLetterStore';
import useDisposisiStore, { SuratDisposisi } from '../../../store/api/useDisposisiStore';

// Components
import TableData from '../table/TableData';
import ButtonIcon from '../buttons/ButtonIcon';
import SubHeader from '../headers/SubHeader';

// Icons
import { IoArrowRedoOutline } from 'react-icons/io5';

export default function Disposisi() {
  const navigate = useNavigate();
  const { fetchSuratById } = useLetterStore();
  const { suratDisposisiByPenerima, fetchDisposisiByUserPenerima, fetchDisposisiStatus } = useDisposisiStore();
  const { getUserId } = useAuthStore();
  const userId = getUserId();

  // Fetch data disposisi
  useEffect(() => {
    if (userId) {
      fetchDisposisiByUserPenerima(userId);
    }
  }, [userId, fetchDisposisiByUserPenerima]);

  useEffect(() => {
    fetchDisposisiStatus();
  }, [fetchDisposisiStatus]);


  const handleNavigate = useCallback(async (id: string) => {
    try {
      // Fetch data surat berdasarkan ID
      await fetchSuratById(id);

      // Lakukan navigasi setelah data berhasil di-fetch
      navigate(`/arsip/disposisi/${id}`);
    } catch (error) {
      console.error("Gagal memuat data surat:", error);
    }
  }, [fetchSuratById, navigate]);

  const columns: ColumnsType<SuratDisposisi> = useMemo(
    () => [
      {
        title: "No Agenda",
        dataIndex: "no_agenda",
        key: "no_agenda",
        align: "center",
        width: 150,
      },
      {
        title: "Tanggal Terima Surat",
        dataIndex: "tanggal_terima",
        key: "tanggal_terima",
        width: 200,
        render: (tanggal_terima) =>
          tanggal_terima ? dayjs(tanggal_terima).format("DD MMMM YYYY") : "-",
      },
      {
        title: "Tanggal Disposisi",
        dataIndex: "tanggal_disposisi",
        key: "tanggal_disposisi",
        width: 200,
        render: () => suratDisposisiByPenerima[0]?.disposisi[0]?.tanggal_disposisi
          ? dayjs(suratDisposisiByPenerima[0]?.disposisi[0]?.tanggal_disposisi).format("DD MMMM YYYY")
          : "-",
      },
      {
        title: "Pengirim",
        dataIndex: "id_pengaju",
        key: "id_pengaju",
        render: () => {
          const pengirim = suratDisposisiByPenerima[0]?.disposisi[0]?.pengaju;
          return (
            <span className="text-ellipsis line-clamp-1">{pengirim?.nama_lengkap}</span>
          );
        },
      },
      {
        title: "Pesan Disposisi",
        dataIndex: "pesan_disposisi",
        key: "pesan_disposisi",
        width: 200,
        render: (_, record) => {
          // Ambil disposisi terakhir dari record
          const lastDisposisi = record.disposisi?.[record.disposisi.length - 1];
          const text = lastDisposisi?.pesan_disposisi || "Tidak ada pesan";

          return (
            <span className="text-ellipsis line-clamp-1 capitalize">{text}</span>
          );
        },
      },
      {
        title: "Status Disposisi",
        dataIndex: "id_status_disposisi",
        key: "id_status_disposisi",
        render: (_, record) => {
          const lastDisposisi = record.disposisi?.[record.disposisi.length - 1];
          const status = lastDisposisi?.status_disposisi;

          return (
            <Badge
              count={status?.nama_status || "Tidak Ada"}
              color={
                status?.id === 1
                  ? "green"
                  : status?.id === 2
                    ? "red"
                    : "blue"
              }
            />
          );
        },
      },
      {
        title: "Tanggal Diarsipkan",
        dataIndex: "created_at",
        key: "created_at",
        width: 200,
        render: (tanggal) =>
          tanggal ? dayjs(tanggal).format("DD MMMM YYYY") : "-",
      },
      {
        title: "Action",
        key: "action",
        align: "center",
        width: 100,
        render: (record) => (
          <Space size="small">
            <ButtonIcon
              tooltipTitle="Ajukan"
              shape="circle"
              icon={<IoArrowRedoOutline />}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate(record.id_surat); // Panggil handleNavigate dengan ID surat
              }}
            />
          </Space>
        ),
      },
    ],
    [suratDisposisiByPenerima, handleNavigate]
  );

  return (
    <section className="bg-white w-full h-full flex flex-col p-5 rounded-lg relative">
      {/* Sub Header */}
      <SubHeader subHeaderTitle="Disposisi" />

      {/* Table Data */}
      <div className="overflow-y-auto flex-grow">
        <TableData<SuratDisposisi>
          dataSource={suratDisposisiByPenerima} // Gunakan data yang sudah difilter
          columns={columns}
        />
      </div>
    </section>
  );
}