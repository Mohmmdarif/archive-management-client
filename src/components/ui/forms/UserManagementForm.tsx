import { Form, Input, FormInstance, Select } from "antd";

interface FormInputConfig {
  fieldLabel: string;
  fieldName: string;
  fieldType: "text" | "password" | "select";
  placeholder: string;
  options?: { label: string; value: string | number }[];
  rules?: any[];
  disable?: boolean;
}

interface UserManagementProps<T> {
  formInput: FormInputConfig[];
  initialValues?: Omit<T, "id"> | null;
  form: FormInstance;
  onSubmit: (values: Omit<T, "id">) => Promise<void>;
}

export default function UserManagementForm<T>({
  formInput,
  initialValues,
  form,
  onSubmit,
}: UserManagementProps<T>) {
  const handleFinish = async (values: { [key: string]: string }) => {
    try {
      await onSubmit(values as Omit<T, "id">);
      form.resetFields();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <Form
      form={form}
      name="user-management-form"
      layout="vertical"
      requiredMark={false}
      onFinish={handleFinish}
      initialValues={initialValues || {}}
      style={{ marginTop: "20px" }}
    >
      {formInput.map((input: FormInputConfig) => {
        const rules = input.rules || [
          {
            required: true,
            message: `${input.fieldLabel} wajib diisi!`,
          },
        ];

        if (input.fieldName === "confirmPassword") {
          rules.push({
            validator(_: any, value: string) {
              if (!value || form.getFieldValue("password") === value) {
                form.setFields([{ name: "confirmPassword", errors: [] }]); // Hapus pesan error
                return Promise.resolve();
              }
              form.setFields([
                {
                  name: "confirmPassword",
                  errors: ["Konfirmasi kata sandi tidak sesuai!"],
                },
              ]); // Set pesan error
              return Promise.reject();
            },
          });
        }

        switch (input.fieldType) {
          case "text":
            return (
              <Form.Item
                key={input.fieldName}
                label={input.fieldLabel}
                name={input.fieldName}
                rules={[
                  ...rules,
                  input.fieldName === "email" && {
                    type: "email",
                    message: "Email tidak valid!",
                  },
                ]}
              >
                <Input
                  placeholder={input.placeholder}
                  style={{ height: "40px" }}
                  disabled={input.disable && initialValues !== null}
                />
              </Form.Item>
            );
          case "password":
            return (
              <Form.Item
                key={input.fieldName}
                label={input.fieldLabel}
                name={input.fieldName}
                rules={rules}
              >
                <Input.Password
                  placeholder={input.placeholder}
                  style={{ height: "40px" }}
                />
              </Form.Item>
            );
          case "select":
            return (
              <Form.Item
                key={input.fieldName}
                label={input.fieldLabel}
                name={input.fieldName}
                rules={rules}
              >
                <Select
                  placeholder={input.placeholder}
                  style={{ height: "40px" }}
                >
                  {input.options?.map((option) => (
                    <Select.Option value={option.value} key={option.value}>
                      {option.label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            );
          default:
            return null;
        }
      })}
    </Form>
  );
}
