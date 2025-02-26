import React, { useState } from "react";
import { Button, Modal } from "antd";

type DefaultModalProps = {
  isOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
};

export default function DefaultModal(props: DefaultModalProps) {
  const { isOpen, handleOk, handleCancel } = props;
  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  // };

  return (
    <>
      <Modal
        title="Basic Modal"
        open={isOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
}
