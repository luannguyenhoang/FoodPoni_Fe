import { AvatarInfo } from "@/components/atoms/AvatarInfo";
import {
  calculateShippingFeeAction,
  fetchAddressesAction,
} from "@/redux/modules/address";
import { fetchCartsAction } from "@/redux/modules/cart";
import {
  CartGroupState,
  createCartGroupRequest,
  deleteCartGroupAction,
  deleteCartGroupSuccess,
  leaveCartGroupAction,
  updateCartGroupSelectedSuccess,
  updateRoomTimeOutInputtingSuccess,
  updateWindowSelectedSuccess,
} from "@/redux/modules/cartGroup.ts";
import { createOrderGroupAction } from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { CurrentUser } from "@/type/types";
import { calculateTotalAmount, currencyFormat } from "@/utils/common.ts";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  LeftOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  notification,
  Popconfirm,
  Row,
  Spin,
  Tabs,
} from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OrderForm, OrderRequest } from "../molecules/OrderForm";
import { CartGroupItems } from "./CartGroupItems";

const useDispatchProp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCarts = () =>
    dispatch(
      fetchCartsAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          status: true,
          sort: ["createdAt,desc"],
        },
      })
    );

  const fetchAddresses = () =>
    dispatch(
      fetchAddressesAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          status: true,
        },
      })
    );

  const calculateShippingFee = (addressId: string) =>
    dispatch(calculateShippingFeeAction({ addressId }));

  const createOrderGroup = (values: OrderRequest, roomId: string) =>
    dispatch(
      createOrderGroupAction({
        values,
        navigate,
        roomId,
      })
    );

  const deleteCartGroup = (roomId: string) =>
    dispatch(deleteCartGroupAction({ roomId }));

  const leaveCartGroup = (roomId: string) =>
    dispatch(leaveCartGroupAction({ roomId }));

  const updateCartGroupSelected = (roomId: string) =>
    dispatch(updateCartGroupSelectedSuccess({ roomId }));

  const createCartGroup = () => dispatch(createCartGroupRequest());

  const updateRoomTimeOutInputting = (roomTimeOutInputting: string) =>
    dispatch(
      updateRoomTimeOutInputtingSuccess({ value: roomTimeOutInputting })
    );

  const updateWindowSelected = (window: "HOME" | "CART_GROUP") =>
    dispatch(updateWindowSelectedSuccess({ window }));

  return {
    fetchCarts,
    fetchAddresses,
    calculateShippingFee,
    createOrderGroup,
    deleteCartGroup,
    leaveCartGroup,
    updateCartGroupSelected,
    createCartGroup,
    updateRoomTimeOutInputting,
    updateWindowSelected,
  };
};

export function CartGroupDetail({
  cartGroupsJoined,
  cartGroupSelected,
  creatingCartGroupLoading,
  currentUser,
  isCreateLoading,
}: {
  cartGroupsJoined: CartGroupState["cartGroupsJoined"];
  cartGroupSelected: string;
  creatingCartGroupLoading: boolean;
  currentUser: CurrentUser;
  isCreateLoading: boolean;
}) {
  const { shippingFee, isCalculateShippingFeeLoading } = useSelector(
    (state: RootState) => state.address
  );

  const {
    fetchCarts,
    fetchAddresses,
    calculateShippingFee,
    createOrderGroup,
    deleteCartGroup,
    leaveCartGroup,
    updateCartGroupSelected,
    createCartGroup,
    updateRoomTimeOutInputting,
    updateWindowSelected,
  } = useDispatchProp();

  useEffect(() => {
    fetchCarts();
    fetchAddresses();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex justify-between mb-4">
        <Button
          icon={<LeftOutlined />}
          onClick={() => updateWindowSelected("HOME")}
        >
          Quay lai
        </Button>
        <Popconfirm
          title={
            <Input
              className="w-36"
              type="text"
              prefix={<ClockCircleOutlined />}
              suffix={"phút"}
              placeholder="Thời lượng"
              onChange={(e) => updateRoomTimeOutInputting(e.target.value)}
            />
          }
          onConfirm={() => createCartGroup()}
        >
          <Button
            loading={creatingCartGroupLoading}
            type="primary"
            size="large"
            icon={<PlusOutlined />}
          >
            Tạo đơn nhóm
          </Button>
        </Popconfirm>
      </div>
      <Tabs
        hideAdd
        type="editable-card"
        onChange={(roomId) => updateCartGroupSelected(roomId)}
        defaultActiveKey={cartGroupSelected}
        items={cartGroupsJoined.map((it) => ({
          key: it.roomId,
          label: (
            <AvatarInfo
              fullName={it.user.username}
              avatar={it.user.avatar}
              info={`#${it.roomId}`}
              isVisibleCapital={true}
              timeout={it.timeout}
              roomId={it.roomId}
              deleteCartGroup={() => {
                deleteCartGroupSuccess({ roomId: it.roomId });
                notification.info({
                  message: "Thông báo!",
                  description: `Đơn nhóm ${it.roomId} của ${it.user.username} đã bị hết hạn!`,
                });
              }}
            />
          ),
          children: (
            <Row gutter={16}>
              <CartGroupItems
                currentUser={currentUser}
                calculateShippingFee={calculateShippingFee}
                currentUserId={currentUser.id}
                it={it}
              />
              {currentUser &&
                it.user.id === currentUser.id &&
                it.cartItems.length > 0 && (
                  <Col flex="300">
                    <Card style={{ marginBottom: "16px" }}>
                      <div className="flex justify-between">
                        <div className="text-gray-500">Tạm tính</div>
                        <span style={{ float: "right" }}>
                          {currencyFormat(
                            calculateTotalAmount(it.cartItems, true)
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-500">Phí vận chuyển</div>
                        <span className="float-right">
                          {isCalculateShippingFeeLoading ? (
                            <Spin />
                          ) : (
                            currencyFormat(
                              currentUser.id === it.user.id ? shippingFee : 0
                            )
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-500">Giảm giá</div>
                        <span className="float-right">0 ₫</span>
                      </div>
                      <Divider />
                      <div className="flex justify-between">
                        <div className="text-gray-500">Tổng tiền</div>
                        <div className="grid">
                          <div className="text-2xl text-red-500 text-right float-right">
                            {currencyFormat(
                              currentUser.id === it.user.id
                                ? calculateTotalAmount(it.cartItems, true) +
                                    shippingFee
                                : calculateTotalAmount(it.cartItems, true)
                            )}
                          </div>
                          <div className="right-0 text-gray-400">
                            (Đã bao gồm VAT nếu có)
                          </div>
                        </div>
                      </div>
                    </Card>
                    <OrderForm
                      currentUserRole={currentUser.role}
                      currentUserAddressId={currentUser.addressId}
                      isCreateLoading={isCreateLoading}
                      enableCartGroup={true}
                      enableOnSubmit={it.cartItems.length > 0}
                      calculateShippingFee={(addressId: string) =>
                        calculateShippingFee(addressId)
                      }
                      onSubmit={(values: OrderRequest) =>
                        createOrderGroup(values, it.roomId)
                      }
                    />
                  </Col>
                )}
              <div className="absolute bottom-0 left-0">
                {it.user.id !== currentUser.id && (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn thoát đơn nhóm không?"
                    onConfirm={() => leaveCartGroup(it.roomId)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button
                      icon={<LogoutOutlined />}
                      className="mr-2"
                      type="default"
                      size="large"
                    >
                      Thoát đơn nhóm
                    </Button>
                  </Popconfirm>
                )}
                {it.user.id === currentUser.id && (
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa đơn nhóm không?"
                    onConfirm={() => deleteCartGroup(it.roomId)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                  >
                    <Button
                      className="bg-red-600 text-white"
                      type="default"
                      loading={it.deletingCartGroupLoading}
                      icon={<DeleteOutlined />}
                    >
                      <span className="sr-only md:not-sr-only">
                        Xóa đơn nhóm
                      </span>
                    </Button>
                  </Popconfirm>
                )}
              </div>
            </Row>
          ),
          closable: false,
        }))}
      />
    </>
  );
}
