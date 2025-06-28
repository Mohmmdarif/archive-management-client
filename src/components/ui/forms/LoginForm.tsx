import { useEffect } from "react";
import { Button, Form, FormProps, Input } from "antd";
import useAuthStore from "../../../store/api/useAuthStore";
import useNotify from "../../../hooks/useNotify";
import { getErrorMessage } from "../../../libs/utils/errorHandler";

type LoginFormType = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const [form] = Form.useForm<LoginFormType>();
  const { notify, contextHolder } = useNotify();
  const { login, isLoading, error } = useAuthStore();

  useEffect(() => {
    if (error) {
      console.error("Error:", error);
    }
  }, [error, notify]);

  const onFinish: FormProps<LoginFormType>["onFinish"] = async (values) => {
    try {
      await login(values);
    } catch (error) {
      notify({
        type: "error",
        notifyTitle: "Error!",
        notifyContent: getErrorMessage(error),
      });
    }
  };

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        name="loginForm"
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item<LoginFormType>
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: "Email wajib diisi!",
            },
            {
              type: "email",
              message: "Email tidak valid!",
            },
          ]}
        >
          <Input placeholder="Email" style={{ height: "40px" }} />
        </Form.Item>
        <Form.Item<LoginFormType>
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password wajib diisi!" },
            { min: 8, message: "Password minimal 8 karakter!" },
          ]}
        >
          <Input.Password placeholder="Password" style={{ height: "40px" }} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            style={{ height: "40px", marginTop: "25px" }}
            loading={isLoading}
            disabled={isLoading}
          >
            Login
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
