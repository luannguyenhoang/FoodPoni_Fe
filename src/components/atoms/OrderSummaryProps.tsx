import { buyAgainOrderAction } from "@/redux/modules/cart";
import { RootState } from "@/redux/store";
import { OrderItem } from "@/type/types";
import { currencyFormat } from "@/utils/common";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";

export const OrderSummary = ({
  totalAmount,
  shippingFee,
  orderItems,
  orderStatus,
}: {
  totalAmount: number;
  shippingFee: number;
  orderItems: Array<OrderItem>;
  orderStatus: string;
}) => {
  const dispatch = useDispatch();
  const { page } = useSelector((state: RootState) => state.cart);
  const { isBuyAgainLoading } = useSelector((state: RootState) => state.cart);

  const isAllItemsInCart = orderItems.every((it) =>
    page.content.some((item) => {
      let isMatch = item.productDetail?.id === it.productDetail?.id;
      if (it.type) {
        isMatch = isMatch && item.type === it.type;
      }
      if (it.toppings?.length) {
        isMatch =
          isMatch &&
          JSON.stringify(item.toppings) === JSON.stringify(it.toppings);
      }
      return isMatch;
    })
  );

  return (
    <div className="text-right">
      <Button
        loading={isBuyAgainLoading}
        className="text-primary"
        disabled={isAllItemsInCart || orderStatus !== "COMPLETED"}
        onClick={() => {
          dispatch(buyAgainOrderAction({ orderItems }));
        }}
      >
        {isAllItemsInCart
          ? "Tất cả món ăn đã có trong giỏ hàng"
          : "Mua lại đơn hàng"}
      </Button>
      <div className="flex justify-end items-center gap-8">
        <div className="text-right text-gray-500">
          <div className="mb-2">Tạm tính</div>
          <div className="mb-2">Phí vận chuyển</div>
          <div className="mb-2">Khuyến mãi vận chuyển</div>
          <div className="mb-2">Giảm giá</div>
          <div className="font-bold">Tổng cộng</div>
        </div>
        <div className="text-right">
          <div className="mb-2">{currencyFormat(totalAmount)}</div>
          <div className="mb-2">{currencyFormat(shippingFee)}</div>
          <div className="mb-2">0 ₫</div>
          <div className="mb-2">0 ₫</div>
          <div className="text-2xl text-orange-600 font-bold">
            {currencyFormat(totalAmount + shippingFee)}
          </div>
        </div>
      </div>
    </div>
  );
};
