import { Spin } from 'antd';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-full">
      <Spin size="large" tip="Loading..." className="text-blue-500" />
    </div>
  );
}
