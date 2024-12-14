import { OrderRequest } from "@/components/molecules/OrderForm";
import { Order, OrderStatus, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import {
  CancelOrder,
  createOrderByCashOrPostPaid,
  createOrderByVNPay,
  getOrderByCustomer,
  getOrderByRetailer,
  getOrdersPageByCustomer,
  getOrdersPageByRetailer,
  getPostPaidOrders,
  getPostPaidOrdersByRetailer,
  getRefundPageByRetailer,
  refund,
  refundConfirmationrefund,
  updateStatus,
} from "@/utils/api/order";
import { getOrderSession } from "@/utils/api/orderSession";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { NavigateFunction } from "react-router-dom";
import { call, fork, put, race, take } from "redux-saga/effects";
import { deleteCartGroupSuccess, updateVisible } from "./cartGroup";
import { addMessageSuccess } from "./message";

export type OrderState = {
  readonly page: Page<
    Array<
      Order & {
        readonly isUpdateStatusLoading: boolean;
        readonly isUpdatePaymentStatusLoading: boolean;
      }
    >
  >;
  readonly selectedOrder: Order | null;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
};

const initialState: OrderState = {
  page: {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 0,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0,
    empty: true,
  },
  selectedOrder: null,
  isFetchLoading: false,
  isCreateLoading: false,
};

const SLICE_NAME = "order";

const orderSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateLoadingForFetchingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchOrdersSuccess: (
      state,
      action: PayloadAction<{ page: OrderState["page"] }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchOrdersFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchOrderSuccess: (state, action: PayloadAction<{ order: Order }>) => ({
      ...state,
      selectedOrder: action.payload.order,
      isFetchLoading: false,
    }),
    fetchOrderFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    createOrderSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createOrderFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateLoadingForCreatingSuccess: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    updateFetchLoading: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    updateLoadingForUpdatingStatus: (
      state,
      action: PayloadAction<{ oid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdateStatusLoading: true,
            };
          }
          return order;
        }),
      },
    }),
    updateOrderStatusSuccess: (
      state,
      action: PayloadAction<{ oid: string; orderStatus: OrderStatus }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.oid) {
            return {
              ...it,
              status: action.payload.orderStatus,
              isUpdateStatusLoading: false,
            };
          }
          return it;
        }),
      },
    }),
    updateOrderStatusFailure: (
      state,
      action: PayloadAction<{ oid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdateStatusLoading: false,
            };
          }
          return order;
        }),
      },
    }),
    updateLoadingForRefunding: (
      state,
      action: PayloadAction<{ oid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdatePaymentStatusLoading: true,
            };
          }
          return order;
        }),
      },
    }),
    refundSuccess: (state, action: PayloadAction<{ oid: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdatePaymentStatusLoading: false,
              payment: {
                ...order.payment,
                status: "REFUNDING",
              },
            };
          }
          return order;
        }),
      },
    }),
    refundFailure: (state, action: PayloadAction<{ oid: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdatePaymentStatusLoading: false,
            };
          }
          return order;
        }),
      },
    }),
    refundConfirmationSuccess: (
      state,
      action: PayloadAction<{ oid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.oid) {
            return {
              ...order,
              isUpdateStatusLoading: false,
              payment: {
                ...order.payment,
                status: "REFUNDED",
              },
              status: "FAILED",
            };
          }
          return order;
        }),
      },
    }),
    cancelOrderSuccess: (state, action: PayloadAction<{ oid: string }>) => {
      state.page.content = state.page.content.filter(
        (order) => order.id !== action.payload.oid
      );
    },
  },
});

export default orderSlice.reducer;

export const {
  fetchOrdersSuccess,
  fetchOrdersFailure,
  fetchOrderSuccess,
  fetchOrderFailure,
  createOrderFailure,
  createOrderSuccess,
  updateLoadingForCreatingSuccess,
  updateFetchLoading,
  updateLoadingForUpdatingStatus,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  updateLoadingForRefunding,
  refundSuccess,
  refundFailure,
  refundConfirmationSuccess,
  cancelOrderSuccess,
} = orderSlice.actions;
export const updateOrderItemsAction = createAction<void>(
  `${SLICE_NAME}/updateOrderItemsRequest`
);
export const fetchOrdersByCustomerAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchOrdersByCustomerRequest`);
export const fetchOrdersByRetailerAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchOrdersByRetailerRequest`);
export const fetchRefundByRetailerAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchRefundByRetailerRequest`);
export const fetchOrderByCustomerAction = createAction<{ orderId: string }>(
  `${SLICE_NAME}/fetchOrderByCustomerRequest`
);
export const fetchOrderByRetailerAction = createAction<{ orderId: string }>(
  `${SLICE_NAME}/fetchOrderByRetailerRequest`
);
export const fetchOrderSessionAction = createAction<{ orderId: string }>(
  `${SLICE_NAME}/fetchOrderSessionRequest`
);
export const fetchPostPaidOrdersAction = createAction<{
  ppid: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchPostPaidOrdersRequest`);
export const fetchPostPaidOrdersByRetailerAction = createAction<{
  ppid: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchPostPaidOrdersByRetailerRequest`);
export const createOrderAction = createAction<{
  navigate: NavigateFunction;
  values: OrderRequest;
}>(`${SLICE_NAME}/createOrderRequest`);
export const createOrderGroupAction = createAction<{
  navigate: NavigateFunction;
  values: OrderRequest;
  roomId: string;
}>(`${SLICE_NAME}/createOrderGroupRequest`);
export const updateOrderStatusAction = createAction<{
  oid: string;
  orderStatus: OrderStatus;
}>(`${SLICE_NAME}/updateOrderStatusRequest`);
export const refundAction = createAction<{
  oid: string;
}>(`${SLICE_NAME}/refundRequest`);
export const refundConfirmationAction = createAction<{
  oid: string;
}>(`${SLICE_NAME}/refundConfirmationRequest`);
export const cancelOrderAction = createAction<{
  oid: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/cancelOrderRequest`);

function* handleFetchOrders() {
  while (true) {
    const {
      fetchOrdersByCustomer,
      fetOrdersByRetailer,
      fetPostPaidOrders,
      fetRefund,
      fetPostPaidOrdersByRetailer,
    }: {
      fetchOrdersByCustomer: ReturnType<typeof fetchOrdersByCustomerAction>;
      fetOrdersByRetailer: ReturnType<typeof fetchOrdersByRetailerAction>;
      fetPostPaidOrders: ReturnType<typeof fetchPostPaidOrdersAction>;
      fetRefund: ReturnType<typeof fetchRefundByRetailerAction>;
      fetPostPaidOrdersByRetailer: ReturnType<
        typeof fetchPostPaidOrdersByRetailerAction
      >;
    } = yield race({
      fetchOrdersByCustomer: take(fetchOrdersByCustomerAction),
      fetOrdersByRetailer: take(fetchOrdersByRetailerAction),
      fetPostPaidOrders: take(fetchPostPaidOrdersAction),
      fetRefund: take(fetchRefundByRetailerAction),
      fetPostPaidOrdersByRetailer: take(fetchPostPaidOrdersByRetailerAction),
    });

    try {
      if (fetchOrdersByCustomer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getOrdersPageByCustomer,
          fetchOrdersByCustomer.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
                isUpdatePaymentStatusLoading: false,
              })),
            },
          })
        );
      }
      if (fetOrdersByRetailer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getOrdersPageByRetailer,
          fetOrdersByRetailer.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
                isUpdatePaymentStatusLoading: false,
              })),
            },
          })
        );
      }
      if (fetPostPaidOrders) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getPostPaidOrders,
          fetPostPaidOrders.payload.ppid,
          fetPostPaidOrders.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
                isUpdatePaymentStatusLoading: false,
              })),
            },
          })
        );
      }
      if (fetRefund) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getRefundPageByRetailer,
          fetRefund.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
                isUpdatePaymentStatusLoading: false,
              })),
            },
          })
        );
      }
      if (fetPostPaidOrdersByRetailer) {
        yield put(updateFetchLoading());
        const page: Page<Order[]> = yield call(
          getPostPaidOrdersByRetailer,
          fetPostPaidOrdersByRetailer.payload.ppid,
          fetPostPaidOrdersByRetailer.payload.queryParams
        );
        yield put(
          fetchOrdersSuccess({
            page: {
              ...page,
              content: page.content.map((order) => ({
                ...order,
                isUpdateStatusLoading: false,
                isUpdatePaymentStatusLoading: false,
              })),
            },
          })
        );
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchOrdersFailure());
    }
  }
}

function* handleFetchOrder() {
  while (true) {
    const {
      fetchOrderByCustomer,
      fetchOrderByRetailer,
      fetchOrderBySession,
    }: {
      fetchOrderByCustomer: ReturnType<typeof fetchOrderByCustomerAction>;
      fetchOrderByRetailer: ReturnType<typeof fetchOrderByRetailerAction>;
      fetchOrderBySession: ReturnType<typeof fetchOrderSessionAction>;
    } = yield race({
      fetchOrderByCustomer: take(fetchOrderByCustomerAction),
      fetchOrderByRetailer: take(fetchOrderByRetailerAction),
      fetchOrderBySession: take(fetchOrderSessionAction),
    });

    try {
      yield put(updateFetchLoading());
      const order: Order = yield call(
        fetchOrderBySession
          ? getOrderSession
          : fetchOrderByCustomer
            ? getOrderByCustomer
            : getOrderByRetailer,
        fetchOrderBySession
          ? fetchOrderBySession.payload.orderId
          : fetchOrderByCustomer
            ? fetchOrderByCustomer.payload.orderId
            : fetchOrderByRetailer.payload.orderId
      );
      yield put(fetchOrderSuccess({ order }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchOrderFailure());
    }
  }
}

function* handleCreateOrder() {
  while (true) {
    const {
      startCreateOrder,
      startCreateOrderGroup,
    }: {
      startCreateOrder: ReturnType<typeof createOrderAction>;
      startCreateOrderGroup: ReturnType<typeof createOrderGroupAction>;
    } = yield race({
      startCreateOrder: take(createOrderAction),
      startCreateOrderGroup: take(createOrderGroupAction),
    });

    try {
      yield put(updateLoadingForCreatingSuccess());

      if (startCreateOrder) {
        const { navigate, values } = startCreateOrder.payload;

        if (values.paymentMethod === "VNPAY") {
          const vnpayUrl: string = yield call(
            createOrderByVNPay,
            values.addressId,
            values.note
          );
          window.location.href = vnpayUrl;
        } else {
          const orderId: string = yield call(
            createOrderByCashOrPostPaid,
            values.addressId,
            values.note,
            values.paymentMethod === "POSTPAID"
          );

          yield put(createOrderSuccess());

          navigate("/don-hang/" + orderId);

          notification.open({
            message: "Đơn hàng",
            description: "Bạn vừa đặt hàng thành công.",
            type: "success",
          });
        }
      }

      if (startCreateOrderGroup) {
        const { navigate, values, roomId } = startCreateOrderGroup.payload;

        if (values.paymentMethod === "VNPAY") {
          const { values } = startCreateOrderGroup.payload;
          const vnpayUrl: string = yield call(
            createOrderByVNPay,
            values.addressId,
            values.note,
            roomId
          );
          window.open(vnpayUrl, "_blank");
        } else {
          const orderId: string = yield call(
            createOrderByCashOrPostPaid,
            values.addressId,
            values.note,
            values.paymentMethod === "POSTPAID",
            roomId
          );

          yield put(createOrderSuccess());

          navigate("/don-hang-nhom/" + orderId);
          notification.open({
            message: "Đơn hàng",
            description: "Bạn vừa đặt hàng thành công.",
            type: "success",
          });
        }
        yield put(updateVisible({ isVisible: false }));
        yield put(deleteCartGroupSuccess({ roomId }));
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));

      yield put(createOrderFailure());
    }
  }
}

function* handleUpdateOrderStatus() {
  while (true) {
    const {
      payload: { oid, orderStatus },
    }: ReturnType<typeof updateOrderStatusAction> = yield take(
      updateOrderStatusAction
    );
    try {
      yield put(updateLoadingForUpdatingStatus({ oid }));
      yield fork(updateOrderStatus, oid, orderStatus);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateOrderStatusFailure({ oid }));
    }
  }
}

function* updateOrderStatus(oid: string, orderStatus: OrderStatus) {
  yield call(updateStatus, oid, orderStatus);
  yield put(updateOrderStatusSuccess({ oid, orderStatus }));
}

function* handleRefundOperations() {
  while (true) {
    const {
      refundNormal,
      refundConfirmation,
    }: {
      refundNormal: ReturnType<typeof refundAction>;
      refundConfirmation: ReturnType<typeof refundConfirmationAction>;
    } = yield race({
      refundNormal: take(refundAction),
      refundConfirmation: take(refundConfirmationAction),
    });

    try {
      if (refundNormal) {
        yield put(updateLoadingForRefunding({ oid: refundNormal.payload.oid }));
        yield call(refund, refundNormal.payload.oid);
        yield put(refundSuccess({ oid: refundNormal.payload.oid }));
      }

      if (refundConfirmation) {
        yield put(
          updateLoadingForUpdatingStatus({
            oid: refundConfirmation.payload.oid,
          })
        );
        yield call(refundConfirmationrefund, refundConfirmation.payload.oid);
        yield put(
          refundConfirmationSuccess({ oid: refundConfirmation.payload.oid })
        );
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));

      yield put(
        updateOrderStatusFailure({ oid: refundConfirmation.payload.oid })
      );
    }
  }
}

function* handleCancelOrder() {
  while (true) {
    const {
      payload: { oid, queryParams },
    }: ReturnType<typeof cancelOrderAction> = yield take(cancelOrderAction);
    try {
      yield put(updateLoadingForUpdatingStatus({ oid }));
      yield call(CancelOrder, oid, queryParams);
      yield put(cancelOrderSuccess({ oid }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
    }
  }
}

export const orderSagas = [
  fork(handleFetchOrders),
  fork(handleFetchOrder),
  fork(handleCreateOrder),
  fork(handleUpdateOrderStatus),
  fork(handleRefundOperations),
  fork(handleCancelOrder),
];
