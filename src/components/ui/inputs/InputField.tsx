import { Form, Input } from "antd";

export default function InputField() {
  return (
    <Form.Item label="Email" name="email" required>
      <Input placeholder="Email" style={{ height: "40px" }} />
    </Form.Item>
  );
}
