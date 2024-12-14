import { ProductFormState } from "@/components/molecules/ProductForm";
import {
  Page,
  Product,
  ProductDetail,
  ProductRatePercent,
} from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common.ts";
import {
  createProduct,
  getProductByIdOrSlug,
  getProductsPage,
  getProductsPageByCategory,
  updateProduct,
  updateProductStatus,
} from "@/utils/api/product.ts";
import {
  getProductDetailsByProductId,
  getProductRatePercent,
} from "@/utils/api/productDetail.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { notification } from "antd";
import { call, fork, put, race, select, take } from "redux-saga/effects";
import { RootState } from "../store";
import { addMessageSuccess } from "./message";

export type ProductState = {
  readonly page: Page<Product[]>;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateLoading: boolean;
  readonly productSelected: {
    readonly product: Product;
    readonly productDetails: ProductDetail[];
  };
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

const initialState: ProductState = {
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
  productSelected: {
    product: {} as Product,
    productDetails: [],
  },
  itemsSelected: {
    productDetail: {} as ProductDetail,
    toppingsSelected: [],
    type: null,
    quantity: 1,
  },
  ratePercents: [],
};

const SLICE_NAME = "product";

const productSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchProductsSuccess: (
      state,
      action: PayloadAction<{ page: Page<Product[]> }>
    ) => ({
      ...state,
      page: action.payload.page,
      isFetchLoading: false,
    }),
    fetchProductsFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForFetchingProductSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchProductSuccess: (
      state,
      action: PayloadAction<{ product: Product }>
    ) => ({
      ...state,
      productSelected: {
        ...state.productSelected,
        product: action.payload.product,
      },
      itemsSelected: {
        ...state.itemsSelected,
        type:
          action.payload.product.types.length > 0
            ? action.payload.product.types[0]
            : null,
      },
    }),
    fetchProductFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    fetchProductDetailsSuccess: (
      state,
      { payload }: { payload: ProductDetail[] }
    ) => ({
      ...state,
      productSelected: {
        ...state.productSelected,
        productDetails: payload,
      },
    }),
    updateProductDetailSelectedSuccess: (
      state,
      action: PayloadAction<{ productDetail: ProductDetail }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        productDetail: action.payload.productDetail,
        toppingsSelected: [],
      },
      isFetchLoading: false,
    }),
    updateTypeSelectedSuccess: (
      state,
      action: PayloadAction<{ type: string }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        type: action.payload.type,
      },
    }),
    updateToppingsSelectedSuccess: (
      state,
      action: PayloadAction<{
        topping: ProductState["itemsSelected"]["toppingsSelected"][0];
      }>
    ) => {
      const check = state.itemsSelected.toppingsSelected.some(
        (it) => it.id === action.payload.topping.id
      );
      if (check) {
        return {
          ...state,
          itemsSelected: {
            ...state.itemsSelected,
            toppingsSelected: state.itemsSelected.toppingsSelected
              .filter((it) => it.id !== action.payload.topping.id)
              .sort((a, b) => a.id.localeCompare(b.id)),
          },
        };
      }

      return {
        ...state,
        itemsSelected: {
          ...state.itemsSelected,
          toppingsSelected: [
            ...state.itemsSelected.toppingsSelected,
            action.payload.topping,
          ].sort((a, b) => a.id.localeCompare(b.id)),
        },
      };
    },
    updateProductSelectedQuantitySuccess: (
      state,
      action: PayloadAction<{ quantity: number }>
    ) => ({
      ...state,
      itemsSelected: {
        ...state.itemsSelected,
        quantity: action.payload.quantity,
      },
    }),
    fetchProductRatePercentSuccess: (
      state,
      action: PayloadAction<{ ratePercents: ProductRatePercent[] }>
    ) => ({
      ...state,
      ratePercents: action.payload.ratePercents,
    }),
    fetchProductRatePercentFailure: (state) => ({
      ...state,
      ratePercents: [],
    }),

    updateLoadingForProductCreate: (state) => ({
      ...state,
      isCreateLoading: true,
    }),
    createProductSuccess: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    createProductFailure: (state) => ({
      ...state,
      isCreateLoading: false,
    }),
    updateLoadingForProductUpdate: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateProductSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateProductFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateLoadingForUpdatingProductStatusSuccess: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateProductStatusSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateProductStatusFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
  },
});
export default productSlide.reducer;

export const {
  updateFetchLoadingSuccess,
  fetchProductsSuccess,
  fetchProductsFailure,
  updateLoadingForFetchingProductSuccess,
  fetchProductSuccess,
  fetchProductFailure,
  fetchProductDetailsSuccess,
  updateProductDetailSelectedSuccess,
  updateTypeSelectedSuccess,
  updateToppingsSelectedSuccess,
  updateProductSelectedQuantitySuccess,
  fetchProductRatePercentSuccess,
  fetchProductRatePercentFailure,
  updateLoadingForProductCreate,
  createProductSuccess,
  createProductFailure,
  updateLoadingForProductUpdate,
  updateProductSuccess,
  updateProductFailure,
  updateLoadingForUpdatingProductStatusSuccess,
  updateProductStatusSuccess,
  updateProductStatusFailure,
} = productSlide.actions;

export const fetchProductAction = createAction<{ pathVariable: string }>(
  `${SLICE_NAME}/fetchProductRequest`
);

export const fetchProductsAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchProductsRequest`
);

export const fetchProductsByProductCategoryAction = createAction<{
  pathVariable: string;
  queryParams: QueryParams;
}>(`${SLICE_NAME}/fetchProductsByCategoryProductRequest`);

export const fetchProductRatePercentAction = createAction<{ pdid: string }>(
  `${SLICE_NAME}/fetchProductRatePercentRequest`
);

export const createProductAction = createAction<{
  product: ProductFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/createProductRequest`);

export const updateProductAction = createAction<{
  product: ProductFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/updateProductRequest`);

export const updateProductStatusAction = createAction<{
  pid: string;
  status: boolean;
}>(`${SLICE_NAME}/updateProductStatusRequest`);

function* handleFetchProducts() {
  while (true) {
    const {
      fetchProducts,
      fetchProductsByProductCategory,
    }: {
      fetchProducts: ReturnType<typeof fetchProductsAction>;
      fetchProductsByProductCategory: ReturnType<
        typeof fetchProductsByProductCategoryAction
      >;
    } = yield race({
      fetchProducts: take(fetchProductsAction),
      fetchProductsByProductCategory: take(
        fetchProductsByProductCategoryAction
      ),
    });
    try {
      yield put(updateFetchLoadingSuccess());
      if (fetchProducts) {
        const page: Page<Product[]> = yield call(
          getProductsPage,
          fetchProducts.payload.queryParams
        );
        yield put(fetchProductsSuccess({ page }));
      }

      if (fetchProductsByProductCategory) {
        const page: Page<Product[]> = yield call(
          getProductsPageByCategory,
          fetchProductsByProductCategory.payload.pathVariable,
          fetchProductsByProductCategory.payload.queryParams
        );
        yield put(fetchProductsSuccess({ page }));
      }
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchProductsFailure());
    }
  }
}

function* handleFetchProduct() {
  while (true) {
    const {
      payload: { pathVariable },
    }: ReturnType<typeof fetchProductAction> = yield take(fetchProductAction);
    try {
      yield put(updateLoadingForFetchingProductSuccess());
      const product: Product = yield call(getProductByIdOrSlug, pathVariable);
      yield fork(handleFetchProductDetails, product.id);
      yield put(fetchProductSuccess({ product }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchProductFailure());
    }
  }
}

function* handleFetchProductDetails(pid: string) {
  try {
    const { content }: Page<ProductDetail[]> = yield call(
      getProductDetailsByProductId,
      pid
    );
    yield put(fetchProductDetailsSuccess(content));
    yield put(
      updateProductDetailSelectedSuccess({ productDetail: content[0] })
    );
  } catch (e) {
    notification.open({
      message: "Error",
      description: e.message,
      type: "error",
    });

    yield put(fetchProductsFailure());
  }
}

function* handleFetchProductRatePercent() {
  while (true) {
    const {
      payload: { pdid },
    }: ReturnType<typeof fetchProductRatePercentAction> = yield take(
      fetchProductRatePercentAction
    );
    try {
      const ratePercents: ProductRatePercent[] = yield call(
        getProductRatePercent,
        pdid
      );
      yield put(fetchProductRatePercentSuccess({ ratePercents }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchProductRatePercentFailure());
    }
  }
}

function* handleCreateProduct() {
  while (true) {
    const {
      startCreateProduct,
      startUpdateProduct,
    }: {
      startCreateProduct: ReturnType<typeof createProductAction>;
      startUpdateProduct: ReturnType<typeof updateProductAction>;
    } = yield race({
      startCreateProduct: take(createProductAction),
      startUpdateProduct: take(updateProductAction),
    });

    try {
      if (startCreateProduct) {
        yield put(updateLoadingForProductCreate());
        yield call(createProduct, startCreateProduct.payload.product);
        yield put(createProductSuccess());
        startCreateProduct.payload.resetForm();
      }

      if (startUpdateProduct) {
        yield put(updateLoadingForProductUpdate());
        yield call(updateProduct, startUpdateProduct.payload.product);
        yield put(updateProductSuccess());
        startUpdateProduct.payload.resetForm();
      }

      const { number, size }: ProductState["page"] = yield select(
        (state: RootState) => state.product.page
      );

      yield put(
        fetchProductsAction({
          queryParams: {
            page: number,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(createProductFailure());
    }
  }
}

function* handleUpdateProductStatus() {
  while (true) {
    const {
      payload: { pid, status },
    }: ReturnType<typeof updateProductStatusAction> = yield take(
      updateProductStatusAction
    );

    try {
      yield put(updateLoadingForUpdatingProductStatusSuccess());
      yield call(updateProductStatus, pid, status);
      yield put(updateProductStatusSuccess());

      const { number, size }: ProductState["page"] = yield select(
        (state: RootState) => state.product.page
      );

      yield put(
        fetchProductsAction({
          queryParams: {
            page: number,
            pageSize: size,
            sort: ["createdAt,desc"],
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateProductStatusFailure());
    }
  }
}

export const productSagas = [
  fork(handleFetchProducts),
  fork(handleFetchProduct),
  fork(handleFetchProductRatePercent),
  fork(handleCreateProduct),
  fork(handleUpdateProductStatus),
];
