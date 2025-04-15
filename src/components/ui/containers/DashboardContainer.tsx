import { useEffect, useRef } from "react";
import useUserManagementStore from "../../../store/api/useUserManagementStore";
import useAuthStore from "../../../store/api/useAuthStore";
import useNotify from "../../../hooks/useNotify";

export default function DashboardContainer() {
  const hasShownNotification = useRef(false);
  const { notify, contextHolder } = useNotify();
  const { isLoggedIn, clearIsLoggedIn } = useAuthStore();
  const { userMe, fetchUserManagementDataById } = useUserManagementStore();

  // show notification when isLoggedIn
  useEffect(() => {
    if (isLoggedIn && !hasShownNotification.current) {
      hasShownNotification.current = true;
      notify({
        type: "success",
        notifyTitle: "Login success",
        notifyContent: "You have successfully logged in.",
      });

      clearIsLoggedIn();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchUserManagementDataById();
  }, [fetchUserManagementDataById]);

  return (
    <section>
      {/* Notify Context */}
      {contextHolder}

      <span className="text-base md:text-xl font-normal">
        Selamat Datang,{" "}
        <span className="font-semibold">{userMe?.nama_lengkap}</span>
      </span>
    </section>
  );
}
