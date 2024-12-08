import { fetchUserByIdAction } from "@/redux/modules/user";
import { RootState } from "@/redux/store.ts";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductLoading } from "../atoms/ProductLoading";
import { UserForm } from "../molecules/UserForm";
import { ManagementLayout } from "../templates/ManagementLayout";
export const AccountInformationPage = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { selectedUser, isFetchLoading } = useSelector(
    (state: RootState) => state.user
  );
  const [showAddAddress, setShowAddAddress] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser?.id) {
      console.log(currentUser);
      
      dispatch(fetchUserByIdAction({ uid: currentUser.id }));
    }
  }, [currentUser?.id]);

  const handleAddAddressClick = (): void => {
    setShowAddAddress(!showAddAddress);
  };

  return (
    <ManagementLayout>
      <div>
        {showAddAddress ? (
          <div className=" mx-auto">
            <div className="flex items-center">
              <button
                onClick={handleAddAddressClick}
                className="text-xl font-sans text-gray-400 hover:text-gray-500"
              >
                Thông tin cá nhân
              </button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 18 18"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5.91107 3.41107C6.23651 3.08563 6.76414 3.08563 7.08958 3.41107L12.0896 8.41107C12.415 8.73651 12.415 9.26415 12.0896 9.58958L7.08958 14.5896C6.76414 14.915 6.23651 14.915 5.91107 14.5896C5.58563 14.2641 5.58563 13.7365 5.91107 13.4111L10.3218 9.00033L5.91107 4.58958C5.58563 4.26414 5.58563 3.73651 5.91107 3.41107Z"
                  fill="#f36f24"
                ></path>
              </svg>
              <div className="text-xl font-sans text-gray-500 hover:text-gray-500">
                Đổi mật khẩu
              </div>
            </div>
            <div></div>
          </div>
        ) : (
          <div>
            <div className="bg-white p-3 rounded-lg grid lg:grid-cols-5 grid-cols-1 gap-4">
              <div className="col-span-3">
                {isFetchLoading ? (
                  <ProductLoading />
                ) : (
                  <UserForm user={selectedUser} />
                )}
              </div>
              <div className="col-span-2">
                <div className="grid lg:grid-cols-2">
                  <div className="border-l-2 col-span-2">
                    <div className="px-4">
                      <h3 className="text-[17px] font-sans text-gray-400">
                        Email
                      </h3>
                      <div className="p-4 grid gap-3">
                        <div className="flex items-center gap-2 justify-between w-[100%]">
                          <div className="flex items-center gap-2 w-[100%]">
                            <div className="text-lg text-gray-600 ml-2 ">
                              <div className="text-[15px]">Địa chỉ email</div>
                              <div className="text-[15px] w-full"></div>
                            </div>
                          </div>
                          <Button>Cập nhật</Button>
                        </div>
                      </div>
                    </div>
                    <div className="px-4">
                      <h3 className="text-[17px] font-sans text-gray-400">
                        Bảo mật
                      </h3>
                      <div className="p-4 grid gap-3">
                        <div className="flex items-center gap-2 justify-between w-[100%]">
                          <div className="flex items-center gap-2 w-[100%]">
                            <div className="text-lg text-gray-600 ml-2 ">
                              <div className="text-[15px]">Đổi mật khẩu</div>
                            </div>
                          </div>
                          <Button onClick={handleAddAddressClick}>
                            Cập nhật
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 grid gap-3">
                        <div className="flex items-center gap-2 justify-between w-[100%]">
                          <div className="flex items-center gap-2 w-[100%]">
                            <div className="text-lg text-gray-600 ml-2 ">
                              <div className="text-[15px]">Bảo mật</div>
                            </div>
                          </div>
                          <Button>Thiết lập</Button>
                        </div>
                      </div>
                      <div className="p-4 grid gap-3">
                        <div className="flex items-center gap-2 justify-between w-[100%]">
                          <div className="flex items-center gap-2 w-[100%]">
                            <div className="text-lg text-gray-600 ml-2  w-full">
                              <div className="text-[15px] w-full ">
                                Yêu cầu xóa tài khoản
                              </div>
                            </div>
                          </div>
                          <Button>Yêu cầu</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagementLayout>
  );
};
