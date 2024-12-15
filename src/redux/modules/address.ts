import { AddressRequest } from "@/components/organisms/ShippingAddressInfo.tsx";
import { Address, Page, SearchResult } from "@/type/types.ts";
import {
  calculateShippingFee,
  calculateShippingFee2,
  createAddress,
  deleteAddressById,
  getAddressesPage,
  searchAddresses,
  updateAddress,
} from "@/utils/api/address.ts";
import { QueryParams } from "@/utils/api/common.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Task } from "redux-saga";
import { call, cancel, delay, fork, put, race, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";

export type AddressState = {
  readonly page: Page<
    Array<
      Address & {
        readonly isDeleteLoading: boolean;
      }
    >
  >;
  readonly addressesSearched: Array<SearchResult>;
  readonly shippingFee: number;
  readonly isShowAddForm: boolean;
  readonly isFetchLoading: boolean;
  readonly isUpdateLoading: boolean;
  readonly isCalculateShippingFeeLoading: boolean;
  readonly isSearchLoading: boolean;
};

const initialState: AddressState = {
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
  addressesSearched: [],
  shippingFee: 0,
  isShowAddForm: false,
  isFetchLoading: false,
  isUpdateLoading: false,
  isCalculateShippingFeeLoading: false,
  isSearchLoading: false,
};

const SLICE_NAME = "address";

const addressSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchAddressesSuccess: (
      state,
      action: PayloadAction<{
        page: AddressState["page"];
      }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: action.payload.page.content.map((it) => {
          return {
            ...it,
          };
        }),
      },
      isFetchLoading: false,
    }),
    fetchAddressesFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForSavingSuccess: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    saveAddressSuccess: (
      state,
      action: PayloadAction<AddressState["page"]["content"][0]>
    ) => {
      const address = state.page.content.find(
        (it) => it.id === action.payload.id
      );

      if (address) {
        return {
          ...state,
          page: {
            ...state.page,
            content: state.page.content.map((it) => {
              if (it.id === action.payload.id) {
                return {
                  ...it,
                  ...action.payload,
                };
              }
              return it;
            }),
          },
          isUpdateLoading: false,
        };
      }

      if (!address) {
        return {
          ...state,
          page: {
            ...state.page,
            content: [
              ...state.page.content,
              {
                ...action.payload,
              },
            ],
          },
          isUpdateLoading: false,
        };
      }

      return state;
    },
    saveAddressFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    updateLoadingForAddressDeleteSuccess: (
      state,
      action: PayloadAction<{ aid: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.aid) {
            return {
              ...it,
              isDeleteLoading: true,
            };
          }
          return it;
        }),
      },
    }),
    deleteAddressSuccess: (state, action: PayloadAction<{ aid: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content
          .map((it) => {
            if (it.id === action.payload.aid) {
              return {
                ...it,
                isDeleteLoading: false,
              };
            }
            return it;
          })
          .filter((it) => it.id !== action.payload.aid),
        totalElements: state.page.totalElements - 1,
      },
    }),
    deleteAddressFailure: (state, action: PayloadAction<{ aid: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((it) => {
          if (it.id === action.payload.aid) {
            return {
              ...it,
              isDeleteLoading: false,
            };
          }
          return it;
        }),
      },
    }),
    updateLoadingForSearchingAddressSuccess: (state) => ({
      ...state,
      isSearchLoading: true,
    }),
    searchAddressesSuccess: (
      state,
      action: PayloadAction<{ addresses: Array<SearchResult> }>
    ) => ({
      ...state,
      addressesSearched: action.payload.addresses,
      isSearchLoading: false,
    }),
    searchAddressesFailure: (state) => ({
      ...state,
      isSearchLoading: false,
    }),
    updateLoadingForCalculatingShippingFeeSuccess: (state) => ({
      ...state,
      isCalculateShippingFeeLoading: true,
    }),
    updateShippingFeeSuccess: (
      state,
      action: PayloadAction<{ shippingFee: number }>
    ) => ({
      ...state,
      shippingFee: action.payload.shippingFee,
      isCalculateShippingFeeLoading: false,
    }),
    updateShippingFeeFailure: (state) => ({
      ...state,
      isCalculateShippingFeeLoading: false,
    }),
    updateShowFormAdding: (
      state,
      action: PayloadAction<{ value: boolean }>
    ) => ({
      ...state,
      isShowAddForm: action.payload.value,
    }),
  },
});
export default addressSlide.reducer;

export const {
  updateFetchLoadingSuccess,
  fetchAddressesSuccess,
  fetchAddressesFailure,
  updateLoadingForSavingSuccess,
  saveAddressSuccess,
  saveAddressFailure,
  updateLoadingForAddressDeleteSuccess,
  deleteAddressSuccess,
  deleteAddressFailure,
  updateLoadingForSearchingAddressSuccess,
  searchAddressesSuccess,
  searchAddressesFailure,
  updateLoadingForCalculatingShippingFeeSuccess,
  updateShippingFeeSuccess,
  updateShippingFeeFailure,
  updateShowFormAdding,
} = addressSlide.actions;

export const fetchAddressesAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchAddressesRequest`
);
export const saveAddressAction = createAction<{ values: AddressRequest }>(
  `${SLICE_NAME}/saveAddressRequest`
);
export const deleteAddressAction = createAction<{
  aid: string;
}>(`${SLICE_NAME}/deleteAddressRequest`);
export const startSearchAddressAction = createAction<{
  value: string;
}>(`${SLICE_NAME}/startSearchAddressRequest`);
export const calculateShippingFeeAction = createAction<{
  addressId: string;
}>(`${SLICE_NAME}/calculateShippingFeeRequest`);
export const calculateShippingFee2Action = createAction<{
  lon: number;
  lat: number;
}>(`${SLICE_NAME}/calculateShippingFee2Request`);

function* handleFetchAddresses() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchAddressesAction> =
      yield take(fetchAddressesAction);
    try {
      yield put(updateFetchLoadingSuccess());

      const page: Page<Array<Address>> = yield call(
        getAddressesPage,
        queryParams
      );
      yield put(
        fetchAddressesSuccess({
          page: {
            ...page,
            content: page.content.map((it) => ({
              ...it,
              isDeleteLoading: false,
            })),
            totalPages: page.totalPages,
            totalElements: page.totalElements,
            size: page.size,
            number: page.number,
            first: page.first,
            last: page.last,
          },
        })
      );
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchAddressesFailure());
    }
  }
}

function* handleCreateAddress() {
  while (true) {
    const {
      payload: { values },
    }: ReturnType<typeof saveAddressAction> = yield take(saveAddressAction);

    try {
      yield put(updateLoadingForSavingSuccess());
      console.log(values.id);
      console.log(values);
      if (values.id) {
        console.log("??");
        yield call(updateAddress, values);
      } else {
        values.id = yield call(createAddress, values);
      }
      yield put(
        saveAddressSuccess({
          ...values,
          isDeleteLoading: false,
        })
      );
      yield put(updateShowFormAdding({ value: false }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(saveAddressFailure());
    }
  }
}

function* deleteAddress(aid: string) {
  yield call(deleteAddressById, aid);
  yield put(deleteAddressSuccess({ aid }));
}

function* handleDeleteAddress() {
  while (true) {
    const {
      payload: { aid },
    }: ReturnType<typeof deleteAddressAction> = yield take(deleteAddressAction);
    try {
      yield put(updateLoadingForAddressDeleteSuccess({ aid }));
      yield fork(deleteAddress, aid);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(deleteAddressFailure({ aid }));
    }
  }
}

function* handleStartSearchAddress() {
  let searchTask: Task | null = null;
  while (true) {
    const {
      payload: { value },
    }: ReturnType<typeof startSearchAddressAction> = yield take(
      startSearchAddressAction
    );

    try {
      if (searchTask) {
        yield cancel(searchTask);
        searchTask = null;
      }

      searchTask = yield fork(searchAddress, value);
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(searchAddressesFailure());
    }
  }
}

function* searchAddress(value: string) {
  yield delay(500);
  yield put(updateLoadingForSearchingAddressSuccess());
  const result: Array<SearchResult> = yield call(searchAddresses, value);
  yield put(searchAddressesSuccess({ addresses: result }));
}

function* handleCalculateShippingFee() {
  while (true) {
    const {
      startCaculateShippingFee,
      startCaculateShippingFee2,
    }: {
      startCaculateShippingFee: ReturnType<typeof calculateShippingFeeAction>;
      startCaculateShippingFee2: ReturnType<typeof calculateShippingFee2Action>;
    } = yield race({
      startCaculateShippingFee: take(calculateShippingFeeAction),
      startCaculateShippingFee2: take(calculateShippingFee2Action),
    });

    try {
      yield put(updateLoadingForCalculatingShippingFeeSuccess());
      const shippingFee: number = startCaculateShippingFee
        ? yield call(
            calculateShippingFee,
            startCaculateShippingFee.payload.addressId
          )
        : yield call(
            calculateShippingFee2,
            startCaculateShippingFee2.payload.lon,
            startCaculateShippingFee2.payload.lat
          );
      yield put(updateShippingFeeSuccess({ shippingFee }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateShippingFeeFailure());
    }
  }
}

export const shippingAddressSagas = [
  fork(handleFetchAddresses),
  fork(handleCreateAddress),
  fork(handleDeleteAddress),
  fork(handleStartSearchAddress),
  fork(handleCalculateShippingFee),
];
