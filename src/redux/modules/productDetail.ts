import { ProductDetailFormState } from "@/components/molecules/ProductDetailForm";
import { Page, Product, ProductDetail } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common.ts";
import {
  createProductDetail,
  deleteProductDetail,
  getProductDetailsByProductId,
  updateProductDetail,
  updateProductDetailStatus,
} from "@/utils/api/productDetail.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import { RootState } from "../store";
import { addMessageSuccess } from "./message";

export type ProductDetailState = {
  readonly page: Page<ProductDetail[]>;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateLoading: boolean;
  readonly productDetailSelected: {
    readonly product: Product;
    readonly productDetails: ProductDetail[];
  };
  readonly itemsSelected: {
    readonly productDetail: ProductDetail;
  };
};

const initialState: ProductDetailState = {
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
  isCreateLoading: false,
  isUpdateLoading: false,
  productDetailSelected: {
    product: {} as Product,
    productDetails: [],
  },
  itemsSelected: {
    productDetail: {} as ProductDetail,
  },
};

const SLICE_NAME = "productDetail";

const productDetailSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchProductDetailsSuccess: (
      state,
      { payload }: PayloadAction<Page<ProductDetail[]>>
    ) => ({
      ...state,
      page: payload,
      isFetchLoading: false,
    }),
    updateProductDetailSelectedSuccess: (
      state,
      action: PayloadAction<{ productDetail: ProductDetail }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        productDetail: action.payload.productDetail,
      },
    }),
    updateLoadingForProductDetailCreate: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createProductDetailSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createProductDetailFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateLoadingForProductDetailUpdate: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateProductDetailSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateProductDetailFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateLoadingForProductDetailDelete: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    deleteProductDetailSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    deleteProductDetailFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    fetchProductDetailsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForProductDetailUpdateStatusSuccess: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateProductDetailStatusSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateProductDetailStatusFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
  },
});
export default productDetailSlide.reducer;

export const {
  updateFetchLoadingSuccess,
  fetchProductDetailsSuccess,
  updateProductDetailSelectedSuccess,
  updateLoadingForProductDetailCreate,
  createProductDetailSuccess,
  createProductDetailFailure,
  updateLoadingForProductDetailUpdate,
  updateProductDetailSuccess,
  updateProductDetailFailure,
  updateLoadingForProductDetailDelete,
  deleteProductDetailSuccess,
  deleteProductDetailFailure,
  fetchProductDetailsFailure,
  updateLoadingForProductDetailUpdateStatusSuccess,
  updateProductDetailStatusSuccess,
  updateProductDetailStatusFailure,
} = productDetailSlide.actions;

export const fetchProductDetailAction = createAction<{
  pathVariable: string;
  queryParams?: QueryParams;
}>("product/fetchProductDetails");

export const createProductDetailAction = createAction<{
  productDetail: ProductDetailFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/createProductDetailRequest`);

export const updateProductDetailAction = createAction<{
  productDetail: ProductDetailFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/updateProductDetailRequest`);

export const deleteProductDetailAction = createAction<{
  pdid: string;
  productId: string;
}>(`${SLICE_NAME}/deleteProductDetailRequest`);

export const updateProductDetailStatusAction = createAction<{
  pdid: string;
  status: boolean;
}>(`${SLICE_NAME}/updateProductDetailStatusRequest`);

function* handleFetchProductDetail() {
  while (true) {
    const action: ReturnType<typeof fetchProductDetailAction> = yield take(
      fetchProductDetailAction
    );
    try {
      yield put(updateFetchLoadingSuccess());
      const response: Page<ProductDetail[]> = yield call(
        getProductDetailsByProductId,
        action.payload.pathVariable,
        action.payload.queryParams
      );
      yield put(fetchProductDetailsSuccess(response));
    } catch (e) {
      notification.error({
        message: "Error",
        description: e.message,
        type: "error",
      });
    }

    yield put(fetchProductDetailsFailure());
  }
}

function* handleProductDetail() {
  while (true) {
    const {
      startCreateProductDetails,
      startUpdateProductDetails,
    }: {
      startCreateProductDetails: ReturnType<typeof createProductDetailAction>;
      startUpdateProductDetails: ReturnType<typeof updateProductDetailAction>;
    } = yield race({
      startCreateProductDetails: take(createProductDetailAction),
      startUpdateProductDetails: take(updateProductDetailAction),
    });

    try {
      if (startCreateProductDetails) {
        yield put(updateLoadingForProductDetailCreate());
        yield call(
          createProductDetail,
          startCreateProductDetails.payload.productDetail
        );
        yield put(createProductDetailSuccess());
        startCreateProductDetails.payload.resetForm();

        const productId =
          startCreateProductDetails.payload.productDetail.productId;
        yield put(
          fetchProductDetailAction({
            pathVariable: productId,
            queryParams: {
              page: 0,
              pageSize: 10,
              sort: ["createdAt,desc"],
            },
          })
        );
      }

      if (startUpdateProductDetails) {
        yield put(updateLoadingForProductDetailUpdate());
        yield call(
          updateProductDetail,
          startUpdateProductDetails.payload.productDetail
        );
        yield put(updateProductDetailSuccess());
        startUpdateProductDetails.payload.resetForm();

        const productId =
          startUpdateProductDetails.payload.productDetail.productId;
        yield put(
          fetchProductDetailAction({
            pathVariable: productId,
            queryParams: {
              page: 0,
              pageSize: 10,
              sort: ["createdAt,desc"],
            },
          })
        );
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createProductDetailFailure());
      yield put(updateProductDetailFailure());
    }
  }
}

function* handleDeleteProductDetail() {
  while (true) {
    const {
      payload: { pdid, productId },
    }: ReturnType<typeof deleteProductDetailAction> = yield take(
      deleteProductDetailAction
    );

    try {
      yield put(updateLoadingForProductDetailDelete());
      yield call(deleteProductDetail, pdid);
      yield put(deleteProductDetailSuccess());
      yield put(
        fetchProductDetailAction({
          pathVariable: productId,
          queryParams: {
            page: 0,
            pageSize: 10,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(deleteProductDetailFailure());
    }
  }
}

function* handleUpdateProductDetailStatus() {
  while (true) {
    const {
      payload: { pdid, status },
    }: ReturnType<typeof updateProductDetailStatusAction> = yield take(
      updateProductDetailStatusAction
    );

    try {
      yield put(updateLoadingForProductDetailUpdateStatusSuccess());
      yield call(updateProductDetailStatus, pdid, status);
      yield put(updateProductDetailStatusSuccess());

      const { number, size }: ProductDetailState["page"] = yield select(
        (state: RootState) => state.productDetail.page
      );
      const { product } = yield select(
        (state: RootState) => state.product.productSelected
      );

      yield put(
        fetchProductDetailAction({
          pathVariable: product.id,
          queryParams: {
            page: number,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateProductDetailStatusFailure());
    }
  }
}

export const productDetailSagas = [
  fork(handleFetchProductDetail),
  fork(handleProductDetail),
  fork(handleDeleteProductDetail),
  fork(handleUpdateProductDetailStatus),
];
