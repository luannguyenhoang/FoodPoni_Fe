import { router } from "@/main";
import { updateCurrentUserSuccess } from "@/redux/modules/auth";
import { RootState } from "@/redux/store";
import { AuthResponse } from "@/type/types";
import { refreshToken } from "@/utils/api/auth";
import { persistToken } from "@/utils/axiosConfig";
import { REFRESH_TOKEN } from "@/utils/server";
import { Button, notification, Result } from "antd";
import Cookies from "js-cookie";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, RouterProvider } from "react-router-dom";
import { LoadingPage } from "./pages/LoadingPage";
import { fetchCartGroupsRequest } from "@/redux/modules/cartGroup.ts";

export const App = () => {
  const dispatch = useDispatch();
  const [api, contextHolder] = notification.useNotification();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { content } = useSelector((state: RootState) => state.message);
  const refresh_token = Cookies.get(REFRESH_TOKEN);

  useEffect(() => {
    if (refresh_token) {
      refreshToken().then((res: AuthResponse) => {
        dispatch(updateCurrentUserSuccess(persistToken(res)));
        dispatch(fetchCartGroupsRequest());
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (content) {
      api.open({
        message:
          content.type === "warning"
            ? "Cảnh báo"
            : content.type === "info"
              ? "Thông báo"
              : content.type === "success"
                ? "Thành công"
                : "Lỗi!",
        description: content.message,
        type: content.type,
      });
    }
  }, [content, api]);

  if (refresh_token && !currentUser) {
    return <LoadingPage />;
  }
  return (
    <>
      {contextHolder}
      <RouterProvider
        router={router(
          currentUser && (currentUser.role as "RETAILER" | "CUSTOMER" | "VIP"),
        )}
      />
    </>
  );
};

export const SecuredRoute = ({
  children,
  currentRole,
  role,
}: {
  children: ReactNode;
  currentRole?: "RETAILER" | "CUSTOMER" | "VIP" | null;
  role: ("RETAILER" | "CUSTOMER" | "VIP")[];
}) => {
  if (!currentRole || (currentRole && role.includes(currentRole))) return <>{children}</>;
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Link to="/">
          <Button type="primary">Back Home</Button>
        </Link>
      }
    />
  );
};
