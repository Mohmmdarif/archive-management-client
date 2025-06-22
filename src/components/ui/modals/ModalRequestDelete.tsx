import React from 'react'
import { Form, Input, Modal } from 'antd'
import { FormInstance } from 'antd/es/form/Form';

interface ModalRequestDeleteProps {
  form: FormInstance;
  isModalOpen: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

export default function ModalRequestDelete({
  form,
  isModalOpen,
  handleOk,
  handleCancel,
}: ModalRequestDeleteProps) {

  return (
    <Modal
      title="Ajukan Penghapusan Surat"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Submit"
      cancelText="Batal"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Alasan Penghapusan"
          name="alasan_penghapusan"
          rules={[{ required: true, message: "Harap isi alasan penghapusan." }]}
        >
          <Input.TextArea rows={4} maxLength={500} placeholder="Tuliskan alasan..." />
        </Form.Item>
      </Form>
    </Modal>
  )
}
