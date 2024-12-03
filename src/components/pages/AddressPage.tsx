import ShippingAddressInfo from "@/components/organisms/ShippingAddressInfo";
import {
  deleteAddressAction,
  fetchAddressesAction,
  updateShowFormAdding,
} from "@/redux/modules/address.ts";
import { updateCurrentUserAddressAction } from "@/redux/modules/auth";
import { RootState } from "@/redux/store.ts";
import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, Collapse, Popconfirm, Radio, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductLoading } from "../atoms/ProductLoading";
import { ManagementLayout } from "../templates/ManagementLayout";

export const AddressPage = () => {
  const dispatch = useDispatch();
  const { isShowAddForm, page, isFetchLoading } = useSelector(
    (state: RootState) => state.address
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(
      fetchAddressesAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  return (
    <ManagementLayout>
      {isFetchLoading ? (
        <ProductLoading />
      ) : (
        <div className="bg-white h-full p-4 rounded-lg">
          <Button
            onClick={() =>
              dispatch(updateShowFormAdding({ value: !isShowAddForm }))
            }
          >
            {isShowAddForm ? "Quay lại" : "Thêm địa chỉ"}
          </Button>
          {isShowAddForm && <ShippingAddressInfo />}
          {!isShowAddForm && (
            <Radio.Group className="w-full">
              <Collapse
                className="my-[16px]"
                accordion
                expandIconPosition="end"
                collapsible="icon"
                expandIcon={() => <span>Sửa</span>}
                items={page.content.map((it) => {
                  return {
                    key: it.id,
                    label: (
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="truncate">
                            <span className="font-bold">{it.fullName}</span> |{" "}
                            {it.phoneNumber}{" "}
                            {currentUser && currentUser.addressId === it.id ? (
                              <span className="text-green-700">
                                <CheckCircleOutlined />{" "}
                                <span className="text-sm">
                                  Địa chỉ mặc định
                                </span>
                              </span>
                            ) : (
                              <span
                                className="px-1 rounded-lg cursor-pointer text-blue-700 hover:underline"
                                onClick={() =>
                                  dispatch(
                                    updateCurrentUserAddressAction({
                                      aid: it.id,
                                    })
                                  )
                                }
                              >
                                Thiết lập mặc định
                              </span>
                            )}
                          </div>
                          <div>{it.address}</div>
                        </div>
                        <Popconfirm
                          className="absolute right-12 top-4"
                          title="Bạn có chắc chắn muốn xóa không?"
                          onConfirm={() =>
                            dispatch(deleteAddressAction({ aid: it.id }))
                          }
                          okText="Đồng ý"
                          cancelText="Hủy"
                        >
                          {it.isDeleteLoading ? (
                            <Spin />
                          ) : (
                            <DeleteOutlined
                              hidden={
                                currentUser
                                  ? currentUser.addressId === it.id
                                  : false
                              }
                            />
                          )}
                        </Popconfirm>
                      </div>
                    ),
                    children: <ShippingAddressInfo address={it} />,
                  };
                })}
              />
            </Radio.Group>
          )}
        </div>
      )}
    </ManagementLayout>
  );
};
