import React from "react";
import { Button, Layout, Result } from "antd";

const NotFound: React.FC = () => (
  <Layout className="h-screen flex justify-center items-center">
    <Result
      status="404"
      title="404"
      subTitle="Oops Sorry!, the page you visited does not exist."
      extra={
        <Button type="primary" href="/dashboard">
          Back Home
        </Button>
      }
    />
  </Layout>
);

export default NotFound;
