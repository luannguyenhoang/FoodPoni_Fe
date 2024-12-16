import { BellOutlined } from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Dropdown,
  notification,
  Radio,
  Result,
  Spin,
} from "antd";
import { useEffect, useState } from "react";

import { server } from "@/utils/server.ts";
import { format, formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useDispatch, useSelector } from "react-redux";

import { ScrollPane } from "@/components/atoms/ScrollPane";
import {
  addToCartItemsSuccess,
  deleteCartGroupSuccess,
  deleteCartItemSuccess,
  kickUserSuccess,
  leaveCartGroupSuccess,
  updateCartItemNoteSuccess,
  updateCartItemQuantitySuccess,
} from "@/redux/modules/cartGroup";
import {
  fetchNotificationsAction,
  markIsReadNotificationsAction,
  pushNotificationsAction,
  pushNotificationSuccess,
} from "@/redux/modules/notification.ts";
import { RootState } from "@/redux/store.ts";
import {
  CartGroupEvent,
  Notification,
  NotificationAttributes,
} from "@/type/types.ts";
import { accessToken } from "@/utils/axiosConfig";
import { getAvatar } from "@/utils/common.ts";
import { getNotificationOrderMessage } from "@/utils/constraint.ts";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";

export default function NotificationDropdown() {
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.notification
  );
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [tab, setTab] = useState<string>("all");

  useEffect(() => {
    dispatch(
      fetchNotificationsAction({
        queryParams: { page: 0, pageSize: 10, sort: ["createdAt,desc"] },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (currentUser) {
      const sock = new SockJS(`${server}/ws?token=Bearer ${accessToken}`);

      if (sock) {
        const client = new Client({
          webSocketFactory: () => sock,
          onConnect: () => {
            console.log("Connect to socket successfully..." + currentUser.id);
            client.subscribe("/user/topic/notifications", (message) => {
              const notificationEvent: Notification = JSON.parse(message.body);

              const attributes = JSON.parse(
                notificationEvent.attributes
              ) as NotificationAttributes;

              if (notificationEvent.toUser.id === currentUser.id) {
                dispatch(
                  pushNotificationSuccess({
                    notification: {
                      ...notificationEvent,
                      isMarkLoading: false,
                    },
                  })
                );
                notification.open({
                  type: [
                    "COMPLETED",
                    "APPROVED",
                    "PENDING",
                    "DELIVERING",
                  ].includes(attributes.orderStatus)
                    ? "success"
                    : "error",
                  placement: "bottomRight",
                  message:
                    notificationEvent.createdAt &&
                    format(
                      new Date(notificationEvent.createdAt),
                      "HH:mm:ss - dd/MM/yyyy"
                    ),
                  description:
                    notificationEvent.type === "POSTPAID"
                      ? `Khách hàng ${notificationEvent.fromUser.username} đã thành toán phiếu nợ`
                      : notificationEvent.type === "REFUND"
                        ? `Đơn hàng #${notificationEvent.id.toUpperCase().substring(0, 6)} đã hoàn tiền thành công`
                        : notificationEvent.type === "ORDER"
                          ? getNotificationOrderMessage(
                              attributes.id,
                              attributes.orderStatus
                            )
                          : `Đơn hàng nhóm của ${notificationEvent.fromUser.username} đã được tạo thành công.`,
                  duration: 10,
                });
              }
            });

            if (currentUser.role !== "RETAILER") {
              client.subscribe("/user/topic/room", (message) => {
                const cartGroupEvent: CartGroupEvent = JSON.parse(message.body);
                if (
                  cartGroupEvent.type === "ADD_CART_ITEM" &&
                  cartGroupEvent.attributes &&
                  "productDetail" in cartGroupEvent.attributes
                ) {
                  const {
                    cartItemId,
                    quantity,
                    productDetail,
                    productName,
                    toppings,
                    type,
                  } = cartGroupEvent.attributes;
                  dispatch(
                    addToCartItemsSuccess({
                      cartItem: {
                        id: cartItemId,
                        quantity,
                        productDetail,
                        productName,
                        user: cartGroupEvent.user,
                        toppings,
                        type,
                      },
                      roomId: cartGroupEvent.roomId,
                    })
                  );
                }

                if (cartGroupEvent.user.id !== currentUser.id) {
                  if (
                    cartGroupEvent.type === "UPDATE_CART_ITEM_QUANTITY" &&
                    cartGroupEvent.attributes &&
                    "cartItemId" in cartGroupEvent.attributes &&
                    "quantity" in cartGroupEvent.attributes
                  ) {
                    const { cartItemId, quantity } = cartGroupEvent.attributes;
                    dispatch(
                      updateCartItemQuantitySuccess({
                        id: cartItemId,
                        quantity,
                      })
                    );
                  }

                  if (
                    cartGroupEvent.type === "UPDATE_CART_ITEM_NOTE" &&
                    cartGroupEvent.attributes &&
                    "cartItemId" in cartGroupEvent.attributes &&
                    "note" in cartGroupEvent.attributes
                  ) {
                    const { cartItemId, note } = cartGroupEvent.attributes;
                    dispatch(
                      updateCartItemNoteSuccess({ id: cartItemId, note })
                    );
                  }

                  if (
                    cartGroupEvent.type === "DELETE_CART_ITEM" &&
                    cartGroupEvent.attributes &&
                    "cartItemId" in cartGroupEvent.attributes
                  ) {
                    const { cartItemId } = cartGroupEvent.attributes;
                    dispatch(deleteCartItemSuccess({ id: cartItemId }));
                  }

                  if (cartGroupEvent.type === "LEAVE_GROUP") {
                    dispatch(
                      leaveCartGroupSuccess({
                        roomId: cartGroupEvent.roomId,
                        userId: cartGroupEvent.user.id,
                      })
                    );
                  }

                  if (cartGroupEvent.type === "DELETE_GROUP") {
                    dispatch(
                      deleteCartGroupSuccess({
                        roomId: cartGroupEvent.roomId,
                      })
                    );
                  }

                  if (
                    cartGroupEvent.type === "KICK_USER" &&
                    "userId" in cartGroupEvent.attributes
                  ) {
                    if (cartGroupEvent.attributes.userId === currentUser.id) {
                      dispatch(
                        deleteCartGroupSuccess({
                          roomId: cartGroupEvent.roomId,
                        })
                      );
                    } else {
                      dispatch(
                        kickUserSuccess({
                          roomId: cartGroupEvent.roomId,
                          userId: cartGroupEvent.attributes.userId,
                        })
                      );
                    }
                  }
                }
              });
            }
          },
          onStompError: (frame) => {
            console.log("Error connecting to Websocket server", frame);
          },
        });
        client.activate();
      }

      return () => {
        if (sock) {
          sock.close();
        }
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Dropdown
        className="cursor-pointer inset-x-0"
        placement="bottomLeft"
        trigger={["click"]}
        dropdownRender={() => (
          <div
            style={{ inlineSize: "fit-content" }}
            className="w-screen md:w-[500px] shadow border rounded-lg bg-white"
          >
            <div className="flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5">
              Thông báo {isFetchLoading && <Spin />}
            </div>
            <div className="border-b border-b-gray-200"></div>
            <div className="px-5 mb-2">
              <div className="text-center">
                <Radio.Group
                  disabled={isFetchLoading}
                  className="my-4"
                  value={tab}
                  onChange={(e) => {
                    setTab(e.target.value);
                    if (e.target.value === "all") {
                      dispatch(
                        fetchNotificationsAction({
                          queryParams: {
                            page: 0,
                            pageSize: 10,
                            sort: ["createdAt,desc"],
                          },
                        })
                      );
                    }
                    if (e.target.value === "unread") {
                      dispatch(
                        fetchNotificationsAction({
                          queryParams: {
                            page: 0,
                            pageSize: 10,
                            sort: ["createdAt,desc"],
                            read: "false",
                          },
                        })
                      );
                    }
                    if (e.target.value === "read") {
                      dispatch(
                        fetchNotificationsAction({
                          queryParams: {
                            page: 0,
                            pageSize: 10,
                            sort: ["createdAt,desc"],
                            read: "true",
                          },
                        })
                      );
                    }
                  }}
                >
                  <Radio.Button value="all">Tất cả</Radio.Button>
                  <Radio.Button value="unread">Chưa đọc</Radio.Button>
                  <Radio.Button value="read">Đã đọc</Radio.Button>
                </Radio.Group>
              </div>
              <ScrollPane
                maxHeight="max-h-[480px]"
                onScroll={(event) => {
                  const { scrollTop, scrollHeight, clientHeight } =
                    event.currentTarget;
                  if (scrollTop + clientHeight >= scrollHeight - 20) {
                    if (!isFetchLoading) {
                      if (!page.last) {
                        dispatch(
                          pushNotificationsAction({
                            queryParams: {
                              page: page.number + 1,
                              pageSize: 10,
                              sort: ["createdAt,desc"],
                            },
                          })
                        );
                      }
                    }
                  }
                }}
              >
                {page.size > 0 ? (
                  <div className="flex flex-col gap-1">
                    {page.content.map((it, index) => {
                      const attributes = JSON.parse(
                        it.attributes
                      ) as NotificationAttributes;
                      return (
                        <div
                          key={index}
                          onClick={() => {
                            if (!it.read) {
                              dispatch(
                                markIsReadNotificationsAction({
                                  id: it.id,
                                })
                              );
                            }
                          }}
                          className={`flex grow gap-2.5 ${!it.read && "bg-gray-100"} hover:bg-gray-50 rounded-lg p-2 cursor-pointer items-center`}
                        >
                          <div className="relative shrink-0">
                            <img
                              alt=""
                              className="object-cover aspect-square rounded-full size-16"
                              src={getAvatar(it.fromUser)}
                            />
                            <div className="bg-[#17c653] rounded-full size-2 badge badge-circle color-white absolute top-14 end-0.5 ring-1 ring-white transform -translate-y-1/2" />
                          </div>
                          <div className="flex flex-col gap-3.5">
                            <div className="flex flex-col gap-1">
                              <div className="text-2sm font-medium">
                                {it.type === "ORDER"
                                  ? getNotificationOrderMessage(
                                      attributes.id,
                                      attributes.orderStatus
                                    )
                                  : `Đơn hàng nhóm của ${it.fromUser.username} đã được tạo thành công.`}
                              </div>
                              <span className="flex items-center text-2xs font-medium text-gray-500">
                                {(() => {
                                  const hoursDiff =
                                    Math.abs(
                                      new Date().getTime() -
                                        new Date(it.createdAt).getTime()
                                    ) / 36e5;

                                  if (hoursDiff > 48) {
                                    return (
                                      <span>
                                        {format(
                                          it.createdAt,
                                          "hh:mm dd-MM-yyyy"
                                        )}
                                      </span>
                                    );
                                  } else if (hoursDiff > 24) {
                                    return (
                                      <span>
                                        Hôm qua {format(it.createdAt, "hh:mm")}
                                      </span>
                                    );
                                  } else {
                                    return (
                                      <span>
                                        {formatDistanceToNow(it.createdAt, {
                                          addSuffix: true,
                                          locale: vi,
                                        })}
                                      </span>
                                    );
                                  }
                                })()}
                              </span>
                            </div>
                          </div>
                          <div className="w-5 h-5 flex items-center justify-center">
                            {it.isMarkLoading ? (
                              <Spin />
                            ) : (
                              <div
                                hidden={it.read}
                                className="w-2 h-2 bg-primary rounded-full"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Result
                    icon={<BellOutlined />}
                    title="Bạn chưa có thông báo"
                  />
                )}
              </ScrollPane>
            </div>
            <div className="border-b border-b-gray-200"></div>
            <div className="grid grid-cols-2 px-4 py-4 gap-2.5">
              <button className="btn btn-sm btn-light justify-center hover:text-[#F36F24]">
                Xem thông báo trước đó
              </button>
              <button className="btn btn-sm btn-light justify-center hover:text-[#F36F24]">
                Đánh dấu tất cả là đã đọc
              </button>
            </div>
          </div>
        )}
      >
        <Badge
          count={
            page.content.filter((it) => !it.read).length > 0
              ? page.content.filter((it) => !it.read).length
              : 0
          }
        >
          <Avatar shape="square" icon={<BellOutlined />} size="large" />
        </Badge>
      </Dropdown>
    </>
  );
}
