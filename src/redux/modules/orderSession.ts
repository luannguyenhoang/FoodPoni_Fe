import { Order } from "@/type/types";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import { call, fork, put, select, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";
import { createOrderSession } from "@/utils/api/orderSession";
import { RootState } from "../store";
import { CartSessionState } from "./cartSession";
import { OrderSessionRequest } from "@/components/molecules/OrderSessionForm";

export type OrderSessionState = {
  readonly orderSessions: Array<Order>;
  readonly isCreateLoading: boolean;
};

const initialState: OrderSessionState = {
  orderSessions: [],
  isCreateLoading: false,
};

const SLICE_NAME = "orderSession";

const orderSessionSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateLoadingForFetchingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchOrderSessionsSuccess: (
      state,
      action: PayloadAction<{ page: OrderSessionState["orderSessions"] }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchOrderSessionsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchOrderSessionSuccess: (
      state,
      action: PayloadAction<{ order: Order }>
    ) => ({
      ...state,
      selectedOrder: action.payload.order,
      isFetchLoading: false,
    }),
    fetchOrderSessionFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForCreatingSuccess: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createOrderSessionSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createOrderSessionFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
  },
});

export default orderSessionSlice.reducer;

export const {
  fetchOrderSessionsSuccess,
  fetchOrderSessionsFailure,
  fetchOrderSessionSuccess,
  fetchOrderSessionFailure,
  updateLoadingForCreatingSuccess,
  createOrderSessionFailure,
  createOrderSessionSuccess,
} = orderSessionSlice.actions;

export const fetchOrderSessionsAction = createAction(
  `${SLICE_NAME}/fetchOrderSessionsRequest`
);

export const fetchOrderSessionAction = createAction<{ orderId: string }>(
  `${SLICE_NAME}/fetchOrderSessionRequest`
);

export const createOrderSessionAction = createAction<{
  navigate: NavigateFunction;
  values: OrderSessionRequest;
}>(`${SLICE_NAME}/createOrderSessionRequest`);

function* handleFetchOrderSessions() {
//   while (true) {
//     try {
//     } catch (e) {
//       yield put(addMessageSuccess({ error: e }));
//       yield put(fetchOrderSessionsFailure());
//     }
//   }
}

function* handleFetchOrderSession() {
//   while (true) {
//     try {
//     } catch (e) {
//       yield put(addMessageSuccess({ error: e }));
//       yield put(fetchOrderSessionFailure());
//     }
//   }
}

function* handleCreateOrderSession() {
  while (true) {
    const {
      payload: { navigate, values },
    }: ReturnType<typeof createOrderSessionAction> = yield take(
      createOrderSessionAction
    );
    const { cartSessions }: CartSessionState = yield select(
      (state: RootState) => state.cartSession
    );

    try {
      yield put(updateLoadingForCreatingSuccess());
      const id: string = yield call(createOrderSession, cartSessions, values);
      sessionStorage.removeItem("cartSessions");

      navigate(`/order/${id}`);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createOrderSessionFailure());
    }
  }
}

export const orderSessionSagas = [
  fork(handleFetchOrderSessions),
  fork(handleFetchOrderSession),
  fork(handleCreateOrderSession),
];
