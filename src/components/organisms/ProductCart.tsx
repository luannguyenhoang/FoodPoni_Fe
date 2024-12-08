import CustomInput from "@/components/molecules/CustomInput.tsx";
import { createCartAction } from "@/redux/modules/cart.ts";
import { addToCartGroupAction } from "@/redux/modules/cartGroup.ts";
import { updateProductSelectedQuantitySuccess } from "@/redux/modules/product.ts";
import { RootState } from "@/redux/store.ts";
import { currencyFormat } from "@/utils/common.ts";
import { Button, Card, Dropdown, Flex } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AvatarInfo } from "../atoms/AvatarInfo.tsx";
import { createCartSessionAction } from "@/redux/modules/cartSession.ts";

export default function ProductCart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toppingsSelected, productDetail, quantity, type } = useSelector(
    (state: RootState) => state.product.itemsSelected
  );
  const { page, isCreateLoading } = useSelector(
    (state: RootState) => state.cart
  );
  const { cartGroupsJoined: cartGroupsJoined, addingToCartItemLoading } =
    useSelector((state: RootState) => state.cartGroup);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const isExisted: boolean = page.content.some(
    (it) =>
      it.productDetail.id === productDetail.id &&
      JSON.stringify(it.toppings) === JSON.stringify(toppingsSelected) &&
      it.type === type
  );

  return (
    <div className="lg:sticky top-5">
      <Card className="text-left text-black h-fit" size="small">
        <div className="flex justify-between mb-6">
          <div>
            <div className="text-md font-medium mb-2">Số lượng</div>
            <CustomInput
              min={1}
              max={100}
              defaultValue={1}
              value={quantity}
              onChange={(value: number) =>
                dispatch(
                  updateProductSelectedQuantitySuccess({ quantity: value })
                )
              }
              disabled={false}
            />
          </div>
          <div>
            <div className="text-md font-medium mb-2">Tạm tính</div>
            <div>
              <div className="text-2xl font-semibold">
                {currencyFormat(
                  (productDetail.price +
                    toppingsSelected.reduce((acc, it) => acc + it.price, 0)) *
                    quantity
                )}
              </div>
            </div>
          </div>
        </div>
        {productDetail.status ? (
          <Flex vertical gap="small" className="w-full">
            <Button
              type="primary"
              danger
              block
              onClick={() => {
                if (!isExisted) {
                  dispatch(
                    currentUser
                      ? createCartAction({ navigate })
                      : createCartSessionAction({ navigate })
                  );
                } else {
                  navigate("/checkout");
                }
              }}
              disabled={currentUser?.role === "RETAILER"}
            >
              Mua ngay
            </Button>
            <Button
              block
              onClick={() =>
                dispatch(
                  currentUser
                    ? createCartAction({ navigate: null })
                    : createCartSessionAction({ navigate: null })
                )
              }
              loading={isCreateLoading}
              disabled={isExisted || currentUser?.role === "RETAILER"}
            >
              {isExisted
                ? "Món ăn đã có trong giỏ hàng"
                : "Thêm vào giỏ hàng"}
            </Button>
            {cartGroupsJoined.length > 0 && (
              <Dropdown
                trigger={["click"]}
                menu={{
                  items: cartGroupsJoined.map((it, index) => ({
                    key: index,
                    label: (
                      <span
                        onClick={() =>
                          dispatch(addToCartGroupAction({ roomId: it.roomId }))
                        }
                      >
                        <AvatarInfo
                          fullName={it.user.username}
                          avatar={it.user.avatar}
                          info={`#${it.roomId}`}
                          timeout={it.timeout}
                        />
                      </span>
                    ),
                  })),
                }}
                placement="bottom"
                arrow
              >
                <Button danger block loading={addingToCartItemLoading}>
                  Thêm vào đơn nhóm
                </Button>
              </Dropdown>
            )}
          </Flex>
        ) : (
          <Flex vertical gap="small" className="w-full">
            <Button disabled={true}>Món ăn này đã hết</Button>
          </Flex>
        )}
      </Card>
    </div>
  );
}
