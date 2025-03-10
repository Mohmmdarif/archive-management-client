import { Modal } from "antd";

type DefaultModalProps = {
  modalTitle: string;
  children: React.ReactNode;
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
};

export default function DefaultModal(props: DefaultModalProps) {
  const { modalTitle, children, isOpen, handleOk, handleCancel } = props;

  return (
    <>
      <Modal
        title={modalTitle}
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Simpan"
        cancelText="Batal"
      >
        {children}
      </Modal>
    </>
  );
}
