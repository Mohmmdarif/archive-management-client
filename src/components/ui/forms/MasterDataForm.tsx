import { Form, Input, FormInstance } from "antd";

const { TextArea } = Input;

interface MasterDataFormProps<T> {
  nameFieldLabel: string;
  nameFieldName: string;
  descriptionFieldLabel: string;
  descriptionFieldName: string;
  namePlaceholder: string;
  descriptionPlaceholder: string;
  initialValues?: Omit<T, "id"> | null;
  form: FormInstance;
  onSubmit: (values: Omit<T, "id">) => Promise<void>;
}

export default function MasterDataForm<T>(props: MasterDataFormProps<T>) {
  const {
    nameFieldLabel,
    nameFieldName,
    descriptionFieldLabel,
    descriptionFieldName,
    namePlaceholder,
    descriptionPlaceholder,
    initialValues,
    onSubmit,
    form,
  } = props;

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
      name="master-data-form"
      layout="vertical"
      requiredMark={false}
      onFinish={handleFinish}
      initialValues={initialValues || {}}
      style={{ marginTop: "20px" }}
    >
      <Form.Item
        label={nameFieldLabel}
        name={nameFieldName}
        rules={[
          {
            required: true,
            message: `${nameFieldLabel} wajib diisi!`,
          },
        ]}
      >
        <Input placeholder={namePlaceholder} style={{ height: "40px" }} />
      </Form.Item>
      <Form.Item
        label={descriptionFieldLabel}
        name={descriptionFieldName}
        rules={[
          {
            required: true,
            message: `${descriptionFieldLabel} wajib diisi!`,
          },
        ]}
      >
        <TextArea placeholder={descriptionPlaceholder} rows={4} />
      </Form.Item>
    </Form>
  );
}
