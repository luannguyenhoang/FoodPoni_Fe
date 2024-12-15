import { CartItems } from "@/components/organisms/CartItems.tsx";
import {
  calculateShippingFeeAction,
  fetchAddressesAction,
} from "@/redux/modules/address.ts";
import { fetchCartsAction } from "@/redux/modules/cart.ts";
import { createOrderAction } from "@/redux/modules/order.ts";
import { RootState } from "@/redux/store.ts";
import { calculateTotalAmount, currencyFormat } from "@/utils/common.ts";
import { Card, Divider, Spin } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OrderForm, OrderRequest } from "../molecules/OrderForm";
import { OrderSessionForm } from "../molecules/OrderSessionForm";
import { DefaultLayout } from "../templates/DefaultLayout";
import { clearValidateSuccess } from "@/redux/modules/message";

const useDispatchProp = () => {
  const dispatch = useDispatch();
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

  return { fetchCarts, fetchAddresses, calculateShippingFee };
};

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { page } = useSelector((state: RootState) => state.cart);
  const { isCreateLoading } = useSelector((state: RootState) => state.order);
  const { shippingFee, isCalculateShippingFeeLoading } = useSelector(
    (state: RootState) => state.address
  );
  const { cartSessions } = useSelector((state: RootState) => state.cartSession);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const { fetchCarts, fetchAddresses, calculateShippingFee } =
    useDispatchProp();

  useEffect(() => {
    if (currentUser) {
      fetchCarts();
      fetchAddresses();

      if (currentUser.addressId) {
        calculateShippingFee(currentUser.addressId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DefaultLayout>
      <div className="p-4 md:p-6 text-black">
        <p className="text-xl md:text-2xl mb-2">GIỎ HÀNG</p>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:flex-1">
            <CartItems currentUser={currentUser} />
          </div>
          <div className="w-full lg:w-[400px]">
            <Card className="mb-4">
              <div className="flex justify-between">
                <div className="text-gray-500">Tạm tính</div>
                <span style={{ float: "right" }}>
                  {currencyFormat(
                    calculateTotalAmount(
                      currentUser ? page.content : cartSessions
                    )
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-500">Phí vận chuyển</div>
                <span className="float-right">
                  {isCalculateShippingFeeLoading ? (
                    <Spin />
                  ) : (
                    currencyFormat(shippingFee)
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
                      calculateTotalAmount(
                        currentUser ? page.content : cartSessions
                      ) + shippingFee
                    )}
                  </div>
                  <div className="right-0 text-gray-400">
                    (Đã bao gồm VAT nếu có)
                  </div>
                </div>
              </div>
            </Card>

            {currentUser && page.content.length > 0 && (
              <div className="w-full">
                <OrderForm
                  currentUserRole={currentUser.role}
                  currentUserAddressId={currentUser.addressId}
                  isCreateLoading={isCreateLoading}
                  enableOnSubmit={
                    page.content.filter((it) => it.checked).length > 0
                  }
                  calculateShippingFee={calculateShippingFee}
                  clearValidate={() => dispatch(clearValidateSuccess())}
                  onSubmit={(values: OrderRequest) =>
                    dispatch(createOrderAction({ values, navigate }))
                  }
                />
              </div>
            )}

            {!currentUser && (
              <Card
                title="Nhập thông tin nhận hàng"
                size="small"
                className="w-full"
              >
                <OrderSessionForm />
              </Card>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
