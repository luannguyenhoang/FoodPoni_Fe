import {
  CartState,
  deleteCartRequest,
  updateCheckedAction,
  updateNoteAction,
} from "@/redux/modules/cart";
import { currencyFormat, getThumbnail } from "@/utils/common";
import { DeleteOutlined } from "@ant-design/icons";
import { Card, Checkbox, Col, Popconfirm, Row, Spin } from "antd";
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
              <div className="relative bg-white border-[1px] rounded-lg mt-2">
                <Row className=" my-[16px] items-center">
                  {!enableCartGroup && (
                    <Col flex="2%">
                      {it.isCheckedLoading ? (
                        <Spin />
                      ) : (
                        <Checkbox
                          className="pl-2"
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
                    </Col>
                  )}
                  <Col flex="40%">
                    <div className="flex items-center">
                      <div>
                        <img
                          src={getThumbnail(it.productDetail.images[0])}
                          className="w-[100px] rounded-lg ml-2"
                          alt="Product"
                        />
                      </div>
                      <div className="ml-[16px] max-w-[200px]">
                        {it.productName}
                        {it.type && (
                          <div className="text-[10px]">
                            Loại:{" "}
                            <span className="bg-primary text-white rounded-lg mr-1 px-1">
                              {it.type}
                            </span>
                          </div>
                        )}
                        {it.toppings.length > 0 && (
                          <div className="text-[10px]">
                            <div>Topping:</div>
                            {it.toppings.map((tp, index) => {
                              return (
                                <div
                                  key={index}
                                  className="inline-block bg-primary text-white rounded-lg mr-1 px-1 mb-1"
                                >{`${tp.name}: ${tp.price}₫`}</div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col flex="9%" className="font-bold">
                    {currencyFormat(it.productDetail.price)}
                  </Col>
                  <Col flex="13%">
                    <div className="text-center">
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
                  </Col>
                  <Col flex="14%" className="font-bold text-red-500">
                    {currencyFormat(
                      (it.productDetail.price +
                        it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
                        it.quantity
                    )}
                  </Col>
                  <Col flex="20%">
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
                          className="h-[35px]"
                        />
                        <span className="absolute right-1 top-1">
                          {it.isUpdateNoteLoading && <Spin />}
                        </span>
                      </div>
                    ) : (
                      <span>{it.note}</span>
                    )}
                  </Col>
                  {!it.user || it.user.id === currentUserId ? (
                    <Col
                      flex="4%"
                      className="text-red absolute right-1 top-1 w-6 h-6 flex items-center justify-center rounded-lg"
                    >
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
                        {it.isDeleteLoading ? <Spin /> : <DeleteOutlined />}
                      </Popconfirm>
                    </Col>
                  ) : (
                    <></>
                  )}
                </Row>
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
