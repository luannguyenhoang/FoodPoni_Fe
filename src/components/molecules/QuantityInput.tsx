import { Button, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import {
  CartState,
  updateQuantityButtonAction,
  updateQuantityInputAction,
} from "@/redux/modules/cart.ts";
import { updateCartItemQuantityAction } from "@/redux/modules/cartGroup.ts";
import {
  updateQuantityButtonCartSessionAction,
  updateQuantityInputCartSessionAction,
} from "@/redux/modules/cartSession";

export function QuantityInput({
  enableCartGroup,
  currentUserId,
  item,
}: {
  enableCartGroup?: boolean;
  currentUserId?: string | null;
  item: CartState["page"]["content"][number];
}) {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center border-[1px] w-24 justify-between rounded-lg">
      <Button
        type="text"
        icon={<MinusOutlined />}
        loading={item.isUpdateQuantityLoading}
        disabled={item.quantity <= 1}
        onClick={() => {
          dispatch(
            currentUserId
              ? !enableCartGroup
                ? updateQuantityButtonAction({
                    type: "DECREASE",
                    id: item.id,
                  })
                : updateCartItemQuantityAction({
                    id: item.id,
                    quantity: item.quantity - 1,
                  })
              : updateQuantityButtonCartSessionAction({
                  type: "DECREASE",
                  id: item.id,
                })
          );
        }}
      />
      <Input
        className="w-10 p-1 text-center"
        min={1}
        max={100}
        defaultValue={1}
        value={item.quantity}
        onChange={(e) => {
          const inputValue = parseInt(e.target.value);
          if (!isNaN(inputValue) && inputValue >= 1 && inputValue <= 100) {
            dispatch(
              currentUserId
                ? !enableCartGroup
                  ? updateQuantityInputAction({
                      id: item.id,
                      quantity: inputValue,
                    })
                  : updateCartItemQuantityAction({
                      id: item.id,
                      quantity: inputValue,
                    })
                : updateQuantityInputCartSessionAction({
                    id: item.id,
                    quantity: inputValue,
                  })
            );
          }
        }}
        disabled={false}
      />
      <Button
        type="text"
        icon={<PlusOutlined />}
        loading={item.isUpdateQuantityLoading}
        disabled={item.quantity >= 100}
        onClick={() =>
          dispatch(
            currentUserId
              ? !enableCartGroup
                ? updateQuantityButtonAction({
                    type: "INCREASE",
                    id: item.id,
                  })
                : updateCartItemQuantityAction({
                    id: item.id,
                    quantity: item.quantity + 1,
                  })
              : updateQuantityButtonCartSessionAction({
                  type: "INCREASE",
                  id: item.id,
                })
          )
        }
      />
    </div>
  );
}
