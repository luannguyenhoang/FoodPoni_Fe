import { AvatarInfo } from "@/components/atoms/AvatarInfo";
import { ScrollPane } from "@/components/atoms/ScrollPane";
import { CartBody } from "@/components/molecules/CartBody";
import { CartHeader } from "@/components/molecules/CartHeader";
import { CartGroupState, kickUserAction } from "@/redux/modules/cartGroup.ts";
import { CurrentUser } from "@/type/types";
import {
  calculateTotalAmount,
  currencyFormat,
  groupCartByUser,
} from "@/utils/common.ts";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Col, Divider, Popconfirm } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export const CartGroupItems = ({
  it,
  currentUserId,
  currentUser,
  calculateShippingFee,
}: {
  it: CartGroupState["cartGroupsJoined"][number];
  currentUserId: string;
  currentUser: CurrentUser;
  calculateShippingFee: (addressId: string) => void;
}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (currentUser && currentUser.addressId && currentUser.id === it.user.id) {
      calculateShippingFee(currentUser.addressId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Col flex="700">
      <ScrollPane maxHeight="h-[600px]">
        <TransitionGroup>
          {groupCartByUser(it.cartItems).map((ci) => (
            <CSSTransition key={ci.user.id} timeout={200} classNames="fade">
              <div>
                <Card
                  size="small"
                  title={
                    <div className="flex justify-between items-center">
                      <AvatarInfo
                        fullName={ci.user.username}
                        avatar={ci.user.avatar}
                        info={`${ci.items.length} món ăn`}
                        padding={"py-1"}
                      />
                      {it.user.id === currentUserId &&
                        ci.user.id !== currentUserId && (
                          <Popconfirm
                            title="Bạn có chắc muốn kick người này?"
                            onConfirm={() => {
                              dispatch(
                                kickUserAction({
                                  roomId: it.roomId,
                                  userId: ci.user.id,
                                })
                              );
                            }}
                            okText="Đồng ý"
                            cancelText="Hủy"
                          >
                            <Button
                              danger
                              type="text"
                              icon={<CloseOutlined />}
                              loading={ci.kickingUserFromCartItemLoading}
                            >
                              Kick
                            </Button>
                          </Popconfirm>
                        )}
                    </div>
                  }
                >
                  <CartHeader enableCartGroup={true} />
                  <CartBody
                    isFetchLoading={false}
                    enableCartGroup={true}
                    carts={ci.items}
                    currentUserId={currentUserId}
                  />
                </Card>
                <div>
                  {currencyFormat(calculateTotalAmount(ci.items, true))}
                </div>
                <Divider />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </ScrollPane>
    </Col>
  );
};
