import {
  CartState,
  deleteCartRequest,
  updateCheckedAction,
  updateNoteAction,
} from "@/redux/modules/cart";
import { currencyFormat, getThumbnail } from "@/utils/common";
import { DeleteOutlined } from "@ant-design/icons";
import { Card, Checkbox, Popconfirm, Spin } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useDispatch } from "react-redux";
import { ProductLoading } from "../atoms/ProductLoading";
import { QuantityInput } from "./QuantityInput";
import {
  deleteCartItemAction,
  updateCartItemNoteAction,
} from "@/redux/modules/cartGroup.ts";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  deleteCartSessionAction,
  updateCheckedCartSessionAction,
  updateNoteCartSessionAction,
} from "@/redux/modules/cartSession";

export const CartBody = ({
  isFetchLoading,
  carts,
  enableCartGroup,
  currentUserId,
}: {
  isFetchLoading: boolean;
  carts: Array<CartState["page"]["content"][number]>;
  enableCartGroup: boolean;
  currentUserId?: string | null;
}) => {
  const dispatch = useDispatch();
  
  return (
    <>
      {isFetchLoading ? (
        <ProductLoading />
      ) : carts.length > 0 ? (
        <TransitionGroup>
          {carts.map((it) => (
            <CSSTransition key={it.id} timeout={500} classNames="fade">
              <div className="relative bg-white border-[1px] rounded-lg mt-2 p-4 relative">
                {/* Checkbox */}
                {!enableCartGroup && (
                  <div className="absolute -top-2 -left-2">
                    {it.isCheckedLoading ? (
                      <Spin />
                    ) : (
                      <Checkbox
                        onClick={() =>
                          dispatch(
                            currentUserId
                              ? updateCheckedAction({
                                  id: it.id,
                                  checked: !it.checked,
                                })
                              : updateCheckedCartSessionAction({
                                  id: it.id,
                                  checked: !it.checked,
                                })
                          )
                        }
                        checked={it.checked}
                      />
                    )}
                  </div>
                )}
                {/* Delete */}
                {(!it.user || it.user.id === currentUserId) && (
                  <div className="absolute top-0 right-0">
                    <Popconfirm
                      title="Bạn có chắc chắn muốn xóa không?"
                      onConfirm={() =>
                        dispatch(
                          currentUserId
                            ? !enableCartGroup
                              ? deleteCartRequest({ id: it.id })
                              : deleteCartItemAction({ id: it.id })
                            : deleteCartSessionAction({ id: it.id })
                        )
                      }
                      okText="Đồng ý"
                      cancelText="Hủy"
                      okButtonProps={{ loading: it.isDeleteLoading }}
                    >
                      {it.isDeleteLoading ? (
                        <Spin />
                      ) : (
                        <DeleteOutlined className="text-red-500" />
                      )}
                    </Popconfirm>
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`md:grid lm:grid-cols-1 lg:grid-cols-12 gap-4 items-start`}
                  >
                    <div className="lg:col-span-4 flex gap-4">
                      <img
                        src={getThumbnail(it.productDetail.images[0])}
                        className="w-[50px] md:w-[80px] h-[50px] md:h-[80px] object-cover rounded-lg"
                        alt="Product"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{it.productName}</h3>
                        {it.type && (
                          <div className="text-sm mb-1 text-nowrap">
                            Loại:{" "}
                            <span className="bg-primary text-white rounded px-1">
                              {it.type}
                            </span>
                          </div>
                        )}
                        {it.toppings.length > 0 && (
                          <div className="text-sm">
                            <div>Topping:</div>
                            <div className="flex flex-wrap gap-1">
                              {it.toppings.map((tp, index) => (
                                <span
                                  key={index}
                                  className="bg-primary text-white rounded px-1"
                                >
                                  {`${tp.name}: ${tp.price}₫`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-5 flex justify-between items-center gap-2">
                      <div className="text-center">
                        <div className="text-gray-500 text-sm lg:hidden">
                          Đơn giá
                        </div>
                        <div className="font-bold">
                          {currencyFormat(it.productDetail.price)}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-sm lg:hidden">
                          Số lượng
                        </div>
                        {!it.user || it.user.id === currentUserId ? (
                          <QuantityInput
                            item={it}
                            enableCartGroup={enableCartGroup}
                            currentUserId={currentUserId}
                          />
                        ) : (
                          <span>{it.quantity}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500 text-sm lg:hidden">
                          Thành tiền
                        </div>
                        <div className="font-bold text-red-500">
                          {currencyFormat(
                            (it.productDetail.price +
                              it.toppings.reduce(
                                (sum, tp) => sum + tp.price,
                                0
                              )) *
                              it.quantity
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="md:col-span-3 lg:flex justify-end">
                      <div className="text-gray-500 text-sm lg:hidden">
                        Ghi chú
                      </div>
                      {!it.user || it.user.id === currentUserId ? (
                        <div className="relative">
                          <TextArea
                            defaultValue={it.note}
                            onChange={(e) =>
                              dispatch(
                                currentUserId
                                  ? enableCartGroup
                                    ? updateCartItemNoteAction({
                                        id: it.id,
                                        note: e.target.value,
                                      })
                                    : updateNoteAction({
                                        id: it.id,
                                        note: e.target.value,
                                      })
                                  : updateNoteCartSessionAction({
                                      id: it.id,
                                      note: e.target.value,
                                    })
                              )
                            }
                            placeholder="Ghi chú"
                            className="!h-[35px]"
                          />
                          {it.isUpdateNoteLoading && (
                            <Spin className="absolute right-2 top-2" />
                          )}
                        </div>
                      ) : (
                        <span>{it.note}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      ) : (
        <Card className="my-2">
          <div className="text-center font-bold">Chưa có món ăn nào!</div>
        </Card>
      )}
    </>
  );
};
