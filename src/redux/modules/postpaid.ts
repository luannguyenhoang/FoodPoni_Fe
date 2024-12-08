import {
  Order,
  Page,
  ProductDetail,
  ProductRatePercent,
} from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common.ts";
import { confirmationPosPaid, getPostPaidByRetailerPage } from "@/utils/api/postpaid";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, race, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type PostPaidState = {
  readonly page: Page<
    Array<
      Order & {
        readonly isUpdateStatusLoading: boolean;
      }
    >
  >;
  readonly isFetchLoading: boolean;
  readonly isUpdateLoading: boolean;
  readonly itemsSelected: {
    readonly productDetail: ProductDetail;
    readonly toppingsSelected: Array<{
      readonly id: string;
      readonly name: string;
      readonly price: number;
    }>;
    readonly type: string | null;
    readonly quantity: number;
  };
  readonly ratePercents: ProductRatePercent[];
};

const initialState: PostPaidState = {
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
  isUpdateLoading: false,

  itemsSelected: {
    productDetail: {} as ProductDetail,
    toppingsSelected: [],
    type: null,
    quantity: 1,
  },
  ratePercents: [],
};

const SLICE_NAME = "postpaid";

const postpaidSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchPostPaidSuccess: (
      state,
      action: PayloadAction<{ page: Page<Order[]> }>
    ) => ({
      ...state,
      page: {
        ...action.payload.page,
        content: action.payload.page.content.map((order) => ({
          ...order,
          isUpdateStatusLoading: false,
        })),
      },
      isFetchLoading: false,
    }),
    fetchPostPaidsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForUpdatingStatus: (
      state,
      action: PayloadAction<{ pid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.pid) {
            return {
              ...order,
              isUpdateStatusLoading: true,
            };
          }
          return order;
        }),
      },
    }),
    confirmationPosPaidSuccess: (
      state,
      action: PayloadAction<{ pid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.pid) {
            return {
              ...order,
              isUpdateStatusLoading: false,
              payment: {
                ...order.payment,
                status: "PAID"
              }
            };
          }
          return order;
        }),
      },
    }),
    updateOrderStatusFailure: (
      state,
      action: PayloadAction<{ pid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((order) => {
          if (order.id === action.payload.pid) {
            return {
              ...order,
              isUpdateStatusLoading: false,
            };
          }
          return order;
        }),
      },
    }),
  },
});
export default postpaidSlide.reducer;

export const {
  updateFetchLoadingSuccess,
  fetchPostPaidSuccess,
  fetchPostPaidsFailure,
  updateLoadingForUpdatingStatus,
  confirmationPosPaidSuccess,
  updateOrderStatusFailure,
} = postpaidSlide.actions;

export const fetchPostPaidByRetailerAction = createAction<{
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchPostPaidRequest`);

export const confirmationPosPaidAction = createAction<{
  pid: string;
}>(`${SLICE_NAME}/confirmationPosPaidRequest`);

function* handleFetchPostPaid() {
  while (true) {
    const {
      fetchPostPaid,
    }: {
      fetchPostPaid: ReturnType<typeof fetchPostPaidByRetailerAction>;
    } = yield race({
      fetchPostPaid: take(fetchPostPaidByRetailerAction),
    });
    try {
      yield put(updateFetchLoadingSuccess());
      if (fetchPostPaid) {
        const page: Page<Order[]> = yield call(
          getPostPaidByRetailerPage,
          fetchPostPaid.payload.queryParams
        );
        yield put(fetchPostPaidSuccess({ page }));
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchPostPaidsFailure());
    }
  }
}

function* handleConfirmationPosPaid() {
  while (true) {
    const { payload: { pid } }: ReturnType<typeof confirmationPosPaidAction> = 
      yield take(confirmationPosPaidAction);
    try {
      yield put(updateLoadingForUpdatingStatus({ pid }));
      yield call(confirmationPosPaid, pid);
      yield put(confirmationPosPaidSuccess({ pid }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateOrderStatusFailure({ pid }));
    }
  }
}

export const postpaidSagas = [
  fork(handleFetchPostPaid),
  fork(handleConfirmationPosPaid)
];
