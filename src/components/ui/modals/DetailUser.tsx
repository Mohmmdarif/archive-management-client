import { Modal, Descriptions, Tag } from "antd";
import { getJabatan, getRole } from "../../../libs/utils/getRole";
import { FaUser } from "react-icons/fa";

interface DetailUserProps {
  userData: {
    [key: string]: any;
  };
  visible: boolean;
  onClose: () => void;
}

export default function DetailUser({
  userData,
  visible,
  onClose,
}: DetailUserProps) {
  const detailFields = [
    {
      key: "nip",
      label: "NIP",
    },
    {
      key: "nama_lengkap",
      label: "Nama Lengkap",
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "role_id",
      label: "Role",
      render: (record: number) => getRole(record),
    },
    {
      key: "jabatan",
      label: "Jabatan",
      render: (record: string) => getJabatan(record) || "-",
    },
    {
      key: "no_telp",
      label: "No. Telp",
    },
    {
      key: "id_jenis_kelamin",
      label: "Jenis Kelamin",
      render: (value: number) => (value == 1 ? "Pria" : "Wanita"),
    },
    {
      key: "status_aktif",
      label: "Status Aktif",
      render: (value: boolean) => (
        <Tag color={value === true ? "green" : "red"}>
          {value === true ? "Aktif" : "Non-Aktif"}
        </Tag>
      ),
    },
  ];

  return (
    <Modal title="Detail User" open={visible} onCancel={onClose} footer={null}>
      {/* Gambar Profile */}
      <div className="flex justify-center">
        {userData.gambar_profil ? (
          <img
            src={userData.gambar_profil}
            alt="Profile"
            className="w-32 h-32 m-4 bg-gray-200 p-2 rounded-full"
          />
        ) : (
          <FaUser
            size={128}
            color="gray"
            className="m-4 bg-gray-200 p-2 rounded-full"
          />
        )}
      </div>
      <Descriptions bordered column={1}>
        {detailFields.map((field: any) => {
          const value = userData[field.key];

          return (
            <Descriptions.Item key={String(field.key)} label={field.label}>
              {field.render ? field.render(value) : value ? value : "-"}
            </Descriptions.Item>
          );
        })}
      </Descriptions>
    </Modal>
  );
}
