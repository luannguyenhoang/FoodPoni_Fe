import { buyBackCartAction } from "@/redux/modules/cart";
import {
  setInitialRatedItems,
  setSelectOrderItemRate,
  setShowModalAddRate,
  updateRateForm,
} from "@/redux/modules/rate";
import { RootState } from "@/redux/store";
import { OrderItem } from "@/type/types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RateAdd from "./RateAdd";

type Props = {
  orderItem: OrderItem;
  orderStatus: string;
  disable?: boolean;
};

export function OrderItemDetail({ orderItem, orderStatus, disable }: Props) {
  const dispatch = useDispatch();

  const { page } = useSelector((state: RootState) => state.cart);
  const ratedOrderItems = useSelector(
    (state: RootState) => state.rate.ratedOrderItems
  );

  useEffect(() => {
    if (orderItem.rate && !ratedOrderItems.includes(orderItem.id)) {
      dispatch(setInitialRatedItems([...ratedOrderItems, orderItem.id]));
    }
  }, [orderItem, ratedOrderItems, dispatch]);

  const isInCart = page.content.some((item) => {
    let isMatch = item.productDetail?.id === orderItem.productDetail?.id;
    if (orderItem.type) {
      isMatch = isMatch && item.type === orderItem.type;
    }
    if (orderItem.toppings?.length) {
      isMatch =
        isMatch &&
        JSON.stringify(item.toppings) === JSON.stringify(orderItem.toppings);
    }
    return isMatch;
  });
  const isRated = ratedOrderItems.includes(orderItem.id);

  return (
    <div className="font-sans text-[17px] text-gray-600 mt-2 gap-2">
      <div className="flex flex-wrap gap-2">
        {orderStatus === "COMPLETED" && !disable && !isRated && (
          <div
            className="text-sm cursor-pointer hover:underline"
            onClick={() => {
              dispatch(setSelectOrderItemRate(orderItem.id));
              dispatch(setShowModalAddRate(true));
              dispatch(updateRateForm({ orderItemId: orderItem.id }));
            }}
          >
            Đánh giá
          </div>
        )}
        {isRated && (
          <div className="text-sm cursor-pointer hover:underline">
            Xem đánh giá
          </div>
        )}

        {!isInCart && orderStatus === "COMPLETED" && (
          <div
            className="text-sm cursor-pointer hover:underline"
            onClick={() => {
              if (orderItem) {
                dispatch(buyBackCartAction({ orderItem }));
              }
              window.location.href = "/checkout";
            }}
          >
            Mua lại
          </div>
        )}
      </div>
      <RateAdd orderItemId={orderItem.id} />
    </div>
  );
}
