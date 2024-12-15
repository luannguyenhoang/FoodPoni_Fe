import HeaderBar from "@/components/molecules/HeaderBar";
import Footer from "@/components/organisms/Footer";
import { HeaderMain } from "@/components/organisms/HeaderMain.tsx";
import { RootState } from "@/redux/store.ts";
import { getThumbnail } from "@/utils/common.ts";
import {
  CustomerServiceOutlined,
  EnvironmentOutlined,
  LikeOutlined,
  MoneyCollectOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Image, Menu, MenuProps } from "antd";
import React, { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const ManagementLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  if (!currentUser) {
    <Navigate to={"/"} />;
    return null;
  }

  return (
    <div>
      <HeaderBar />
      <HeaderMain />
      <div className="bg-[#F5F5FA]">
        <div className="px-2 max-w-screen-xl mx-auto py-4">
          <div className="flex gap-4">
            <div className="w-full p-4 bg-white rounded-lg h-fit">
              <div className="flex">
                <Image
                  width={50}
                  height={50}
                  className="object-center rounded-full shadow-lg  overflow-hidden object-cover "
                  src={getThumbnail(currentUser.avatar)}
                  preview={false}
                />
                <div className="mx-2">
                  <span className="text-[13px] text-gray-500 font-extralight">
                    Tài khoản của
                  </span>
                  <div className="nunito text-orange-500">
                    {currentUser.username}
                  </div>
                </div>
              </div>
              <div className="mt-[16px]">
                <Menu
                  onClick={(e) => navigate(`${e.key}`)}
                  className="w-full lg:min-w-[256px] rounded-[8px] !border-none mb-4"
                  selectedKeys={[location.pathname]}
                  mode="horizontal"
                  items={[
                    getItem(
                      "Thông tin tài khoản",
                      "/thong-tin-tai-khoan",
                      <UserOutlined />
                    ),
                    getItem(
                      "Sổ địa chỉ",
                      "/so-dia-chi",
                      <EnvironmentOutlined />
                    ),
                    getItem(
                      "Quản lý đơn hàng",
                      "/don-hang",
                      <ProfileOutlined />
                    ),
                    getItem(
                      "Quản lý đơn hàng nhóm",
                      "/don-hang-nhom",
                      <ProfileOutlined />
                    ),
                    ...(currentUser.role === "VIP"
                      ? [
                          getItem(
                            "Quản lý ghi nợ",
                            "/ghi-no",
                            <MoneyCollectOutlined />
                          ),
                        ]
                      : []),

                    getItem(
                      "Món ăn yêu thích",
                      "/san-pham-yeu-thich",
                      <LikeOutlined />
                    ),
                    getItem(
                      "Hỗ trợ khách hàng",
                      "/ho-tro-khach-hang",
                      <CustomerServiceOutlined />
                    ),
                  ]}
                />
                <div className="w-full">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center">
        <Footer />
      </div>
    </div>
  );
};
