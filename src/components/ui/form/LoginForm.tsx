import { Button, Form, FormProps, Input } from "antd";

type LoginFormType = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const onFinish: FormProps<LoginFormType>["onFinish"] = (values) => {
    console.log(values);
  };

  return (
    <Form
      name="loginForm"
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
    >
      <Form.Item<LoginFormType> label="Email" name="email" required>
        <Input placeholder="Email" style={{ height: "40px" }} />
      </Form.Item>
      <Form.Item<LoginFormType> label="Password" name="password" required>
        <Input.Password placeholder="Password" style={{ height: "40px" }} />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
          style={{ height: "40px" }}
        >
          Login
        </Button>
      </Form.Item>
    </Form>
  );
}
