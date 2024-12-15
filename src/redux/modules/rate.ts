import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, put, fork, take, select } from "redux-saga/effects";
import { notification } from "antd";
import { Rate, Page } from "@/type/types";
import { getRatesByProductId, createRate } from "@/utils/api/rate";
import { QueryParams } from "@/utils/api/common";
import { RootState } from "@/redux/store";
import { addMessageSuccess } from "./message";

export type RateState = {
  readonly page: Page<Rate[]>;
  readonly isLoading: boolean;
  readonly showModalAddRate: boolean;
  readonly selectOrderItemRate: string;
  readonly showModalFileUpload: boolean;
  readonly form: {
    rate: number;
    message: string;
    images: string[];
    orderItemId: string;
  };
  readonly ratedOrderItems: string[];
};

const initialState: RateState = {
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
  isLoading: false,
  showModalAddRate: false,
  selectOrderItemRate: "",
  showModalFileUpload: false,
  form: {
    rate: 0,
    message: "",
    images: [],
    orderItemId: "",
  },
  ratedOrderItems: [],
};

const SLICE_NAME = "rate";

const rateSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    getRatesSuccess: (
      state,
      action: PayloadAction<{ page: Page<Rate[]> }>
    ) => ({
      ...state,
      page: action.payload.page,
      isLoading: false,
    }),
    getRatesFailure: (state) => ({
      ...state,
      isLoading: false,
    }),
    createRateSuccess: (state, action: PayloadAction<Rate>) => ({
      ...state,
      isLoading: false,
      showModalAddRate: false,
      form: initialState.form,
      page: {
        ...state.page,
        content: [action.payload, ...state.page.content],
        totalElements: state.page.totalElements + 1,
      },
      ratedOrderItems: [...state.ratedOrderItems, state.selectOrderItemRate],
    }),
    createRateFailure: (state) => ({
      ...state,
      isLoading: false,
    }),
    setShowModalAddRate: (state, action: PayloadAction<boolean>) => ({
      ...state,
      showModalAddRate: action.payload,
    }),
    setSelectOrderItemRate: (state, action: PayloadAction<string>) => ({
      ...state,
      selectOrderItemRate: action.payload,
    }),
    setShowModalFileUpload: (state, action: PayloadAction<boolean>) => ({
      ...state,
      showModalFileUpload: action.payload,
    }),
    updateLoadingSuccess: (state) => ({
      ...state,
      isLoading: true,
    }),
    updateRateForm: (
      state,
      action: PayloadAction<Partial<RateState["form"]>>
    ) => ({
      ...state,
      form: {
        ...state.form,
        ...action.payload,
      },
    }),
    setInitialRatedItems: (state, action: PayloadAction<string[]>) => ({
      ...state,
      ratedOrderItems: action.payload,
    }),
    addRatedOrderItem: (state, action: PayloadAction<string>) => {
      state.ratedOrderItems.push(action.payload);
    },
  },
});

export default rateSlice.reducer;

export const {
  getRatesSuccess,
  getRatesFailure,
  createRateSuccess,
  createRateFailure,
  setShowModalAddRate,
  setSelectOrderItemRate,
  setShowModalFileUpload,
  updateLoadingSuccess,
  updateRateForm,
  setInitialRatedItems,
  addRatedOrderItem,
} = rateSlice.actions;

export const getRatesAction = createAction<{
  productId: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/getRatesRequest`);
export const createRateAction = createAction(`${SLICE_NAME}/createRateRequest`);

function* handleGetRates() {
  while (true) {
    const {
      payload: { productId, queryParams },
    }: ReturnType<typeof getRatesAction> = yield take(getRatesAction);
    try {
      yield put(updateLoadingSuccess());
      const page: Page<Rate[]> = yield call(
        getRatesByProductId,
        productId,
        queryParams
      );
      yield put(getRatesSuccess({ page }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(getRatesFailure());
    }
  }
}

function* handleCreateRate() {
  while (true) {
    yield take(createRateAction);
    try {
      yield put(updateLoadingSuccess());
      const { selectOrderItemRate: orderItemId, form } = yield select(
        (state: RootState) => state.rate
      );

      const rateRequest: Rate = {
        ...form,
        name: "",
        thumbnail: "",
        username: "",
        avatar: "",
      };

      const newRate: Rate = yield call(createRate, orderItemId, rateRequest);
      yield put(createRateSuccess(newRate));
      yield put(addRatedOrderItem(orderItemId));
      notification.success({
        message: "Đánh giá",
        description: "Đánh giá thành công!",
      });
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createRateFailure());
    }
  }
}

export const rateSagas = [fork(handleGetRates), fork(handleCreateRate)];
