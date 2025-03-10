import { notification } from "antd";

type NotificationType = "success" | "error" | "warning" | "info";

interface NotifyProps {
  type: NotificationType;
  notifyTitle: string;
  notifyContent: string;
}

const useNotify = () => {
  const [api, contextHolder] = notification.useNotification();

  const notify = ({ type, notifyTitle, notifyContent }: NotifyProps) => {
    api.open({
      message: notifyTitle,
      description: notifyContent,
      type: type,
      showProgress: true,
    });
  };

  return { contextHolder, notify };
};

export default useNotify;
