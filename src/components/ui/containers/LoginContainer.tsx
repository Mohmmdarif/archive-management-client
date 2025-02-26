import { Layout } from "antd";

import LoginForm from "../forms/LoginForm";
import LoginFormHeader from "../headers/LoginFormHeader";

export default function LoginContainer() {
  return (
    <Layout className="h-screen flex justify-center items-center">
      {/* Background */}
      <section className="h-full relative">
        <img
          src="../../images/login-bg.webp"
          alt="logo"
          className="w-dvw h-full"
        />
      </section>

      {/* Form Card */}
      <section className="w-[90%] md:w-96 absolute bg-white p-8 rounded-lg shadow-md">
        {/* Form Header */}
        <LoginFormHeader />

        {/* Form Input */}
        <LoginForm />
      </section>
    </Layout>
  );
}
