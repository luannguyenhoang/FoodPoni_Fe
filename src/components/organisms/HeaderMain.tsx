import SearchKeyword from "@/components/molecules/SearchKeyword";
import { UserDropdown } from "@/components/molecules/UserDropdown";
import Cart from "@/components/organisms/Cart";
import NotificationDropdown from "@/components/organisms/NotificationDropdown";
import { RootState } from "@/redux/store.ts";
import { UserOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { getMediaQuery } from "../../../styles/breakpoints";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  return matches;
};

export const HeaderMain = memo(() => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const isLg = useMediaQuery(getMediaQuery("lg"));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] px-2 mx-auto items-center py-2 max-w-screen-xl">
      <div className="flex items-center justify-between lg:justify-start">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-1 nunito text-3xl md:text-4xl text-orange-400 cursor-pointer hover:text-orange-500"
        >
          <img
            src="/logo-02.png"
            className="w-10 h-10 lg:w-14 lg:h-14"
            alt="FoodPoni Logo"
          />
          <div className="md:block">FoodPoni</div>
        </div>
        <div className="flex items-center justify-end gap-4 order-2 lg:order-3">
          {!isLg &&
            (!currentUser ||
              (currentUser && currentUser.role !== "RETAILER")) && (
              <Cart currentUser={currentUser} />
            )}
          {!currentUser ? (
            <Button
              className="block lg:hidden"
              type="primary"
              onClick={() => navigate("/login")}
              icon={<UserOutlined />}
              size="large"
            >
              <span className="sr-only md:not-sr-only">Đăng nhập</span>
            </Button>
          ) : (
            !isLg && (
              <>
                <NotificationDropdown />
                <UserDropdown />
              </>
            )
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] items-center gap-4">
        <div className="order-1 lg:order-2 mt-4 lg:mt-0">
          <SearchKeyword />
        </div>

        {isLg && (
          <div className="order-2 hidden lg:block text-end">
            <div className="flex items-center justify-end gap-4 order-2 lg:order-3">
              {(!currentUser ||
                (currentUser && currentUser.role !== "RETAILER")) && (
                <Cart currentUser={currentUser} />
              )}
              {currentUser ? (
                <>
                  <NotificationDropdown />
                  <UserDropdown />
                </>
              ) : (
                <Button
                  type="primary"
                  onClick={() => navigate("/login")}
                  icon={<UserOutlined />}
                  size="large"
                >
                  <span className="">Đăng nhập</span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
