import { OrderItem, Page } from "@/type/types";
import { QueryParams } from "@/utils/api/common";
import { getOrderItemsPageByCustomer, getOrderItemsPageByAnonymous } from "@/utils/api/orderItem";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type OrderItemState = {
  readonly page: Page<OrderItem[]>;
  readonly isFetchLoading: boolean;
};

const initialState: OrderItemState = {
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

  isFetchLoading: false,
};

const SLICE_NAME = "orderItem";

const orderItemSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchOrderItemsSuccess: (
      state,
      action: PayloadAction<{ page: Page<OrderItem[]> }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchOrderItemsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
  },
});

export default orderItemSlice.reducer;

export const {
  updateFetchLoadingSuccess,
  fetchOrderItemsSuccess,
  fetchOrderItemsFailure,
} = orderItemSlice.actions;

export const fetchOrderItemsByOrderIdAction = createAction<{
  oid: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchOrderItemsByOrderIdRequest`);

export const fetchOrderItemsByAnonymousAction = createAction<{
  oid: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchOrderItemsByAnonymousRequest`);

function* handleFetchOrderItemsByOrderId() {
  while (true) {
    const {
      payload: { oid, queryParams },
    }: ReturnType<typeof fetchOrderItemsByOrderIdAction> = yield take(
      fetchOrderItemsByOrderIdAction
    );
    try {
      yield put(updateFetchLoadingSuccess());
      const page: Page<OrderItem[]> = yield call(
        getOrderItemsPageByCustomer,
        oid,
        queryParams
      );
      yield put(fetchOrderItemsSuccess({ page }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchOrderItemsFailure());
    }
  }
}

function* handleFetchOrderItemsByAnonymous() {
  while (true) {
    const { payload: { oid ,queryParams} }: ReturnType<typeof fetchOrderItemsByAnonymousAction> = yield take(
      fetchOrderItemsByAnonymousAction
    );
    try {
      yield put(updateFetchLoadingSuccess());
      const page: Page<OrderItem[]> = yield call(
        getOrderItemsPageByAnonymous,
        oid,
        queryParams
      );
      yield put(fetchOrderItemsSuccess({ page }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchOrderItemsFailure());
    }
  }
}

export const orderItemSagas = [fork(handleFetchOrderItemsByOrderId), fork(handleFetchOrderItemsByAnonymous)];
