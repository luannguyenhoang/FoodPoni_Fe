import { ProductState } from "@/redux/modules/product.ts";
import { RootState } from "@/redux/store.ts";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import {
  fork,
  put,
  race,
  select,
  take
} from "redux-saga/effects";
import { CartState } from "./cart";
import { toSlug } from "@/utils/common";

export type CartSessionState = {
  readonly cartSessions: CartState["page"]["content"];
};

const initialState: CartSessionState = {
  cartSessions: JSON.parse(sessionStorage.getItem("cartSessions") || "[]")
};

const SLICE_NAME = "cartSession";

const cartSessionListSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    createCartSesstionSuccess: (
      state,
      action: PayloadAction<{ cartSessions: CartSessionState["cartSessions"] }>
    ) => ({
      ...state,
      cartSessions: action.payload.cartSessions,
    }),
    updateQuantityCartSessionSuccess: (
      state,
      action: PayloadAction<{ cartSessions: CartSessionState["cartSessions"] }>
    ) => ({
      ...state,
      cartSessions: action.payload.cartSessions
    }),
    updateNoteCartSessionSuccess: (
      state,
      action: PayloadAction<{ cartSessions: CartSessionState["cartSessions"] }>
    ) => ({
      ...state,
      cartSessions: action.payload.cartSessions
    }),
    updateCheckedCartSessionSuccess: (
      state,
      action: PayloadAction<{ cartSessions: CartSessionState["cartSessions"] }>
    ) => ({
      ...state,
      cartSessions: action.payload.cartSessions
    }),
    updateAllCheckedCartSessionSuccess: (
      state,
      action: PayloadAction<{ cartSessions: CartSessionState["cartSessions"] }>
    ) => ({
      ...state,
      cartSessions: action.payload.cartSessions,
    }),
    deleteCartSessionSuccess: (state, action: PayloadAction<{ cartSessions: CartSessionState["cartSessions"] }>) => (
      {
        ...state,
        cartSessions: action.payload.cartSessions
      }
    ),
    deleteAllCartSessionSuccess: (state) => ({
      ...state,
      cartSessions: []
    }),
  },
});
export default cartSessionListSlide.reducer;

export const {
  createCartSesstionSuccess,
  updateQuantityCartSessionSuccess,
  updateNoteCartSessionSuccess,
  updateCheckedCartSessionSuccess,
  updateAllCheckedCartSessionSuccess,
  deleteCartSessionSuccess,
  deleteAllCartSessionSuccess,
} = cartSessionListSlide.actions;

export const createCartSessionAction = createAction<{
  navigate: NavigateFunction | null;
}>(`${SLICE_NAME}/createCartSessionRequest`);

export const updateQuantityButtonCartSessionAction = createAction<{
  type: "INCREASE" | "DECREASE";
  id: string;
}>(`${SLICE_NAME}/updateQuantityButtonCartSessionRequest`);

export const updateQuantityInputCartSessionAction = createAction<{
  id: string;
  quantity: number;
}>(`${SLICE_NAME}/updateQuantityInputCartSessionRequest`);

export const updateNoteCartSessionAction = createAction<{
  id: string;
  note: string;
}>(`${SLICE_NAME}/updateNoteCartSessionRequest`);

export const updateCheckedCartSessionAction = createAction<{
  id: string;
  checked: boolean;
}>(`${SLICE_NAME}/updateCheckedCartSessionRequest`);

export const updateAllCheckedCartSessionAction = createAction(`${SLICE_NAME}/updateAllCheckedCartSessionRequest`);

export const deleteCartSessionAction = createAction<{
  id: string;
}>(`${SLICE_NAME}/deleteCartSessionRequest`);

export const deleteAllCartSessionsAction = createAction(`${SLICE_NAME}/deleteAllCartsRequest`);

function* handleCreateCart() {
  while (true) {
    const {
      payload: { navigate },
    }: ReturnType<typeof createCartSessionAction> = yield take(createCartSessionAction);

    const {
      productDetail,
      toppingsSelected,
      type,
      quantity,
    }: ProductState["itemsSelected"] = yield select(
      (state: RootState) => state.product.itemsSelected
    );
    const { product }: ProductState["productSelected"] = yield select(
      (state: RootState) => state.product.productSelected
    );

    const cartSession = {
      id: productDetail.id.substring(0, 5) + Array.from(new Set(toppingsSelected.map(it => it.id.substring(0, 5)))).join(",") + toSlug(type || ""),
      quantity,
      productName: product.name + " - " + productDetail.name,
      productDetail: {
        id: productDetail.id,
        name: productDetail.name,
        price: productDetail.price,
        images: productDetail.images,
      },
      toppings: toppingsSelected,
      type: type,
      checked: true,
    };

    const { cartSessions }: CartSessionState = yield select((state: RootState) => state.cartSession);

    const newCartSessions = cartSessions
      .map(it => it.id)
      .includes(cartSession.id) ? cartSessions : [...cartSessions, cartSession];

    yield put(createCartSesstionSuccess({ cartSessions: newCartSessions }));

    sessionStorage.setItem("cartSessions", JSON.stringify(newCartSessions));

    if (navigate) {
      navigate("/checkout");
    }
  }
}

function* handleUpdateQuantityCart() {
  while (true) {
    const {
      updateQuantityButton,
      updateQuantityInput,
    }: {
      updateQuantityButton: ReturnType<typeof updateQuantityButtonCartSessionAction>;
      updateQuantityInput: ReturnType<typeof updateQuantityInputCartSessionAction>;
    } = yield race({
      updateQuantityButton: take(updateQuantityButtonCartSessionAction),
      updateQuantityInput: take(updateQuantityInputCartSessionAction),
    });

    const { id } = updateQuantityButton ? updateQuantityButton.payload : updateQuantityInput.payload;

    const { cartSessions }: CartSessionState = yield select(
      (state: RootState) => state.cartSession
    );

    const cartSession = cartSessions.find((it) => it.id === id);

    if (cartSession) {
      let quantityEdit = cartSession.quantity;

      if (updateQuantityButton) {
        const { type } = updateQuantityButton.payload;

        if (type === "DECREASE") {
          if (cartSession.quantity > 1) {
            quantityEdit -= 1;
          }
        }

        if (type === "INCREASE") {
          quantityEdit += 1;
        }
      }
      if (updateQuantityInput) {
        const { quantity } = updateQuantityInput.payload;
        quantityEdit = quantity;
      }

      const { cartSessions }: CartSessionState = yield select((state: RootState) => state.cartSession);

      const newCartSessions = cartSessions.map((it) => it.id === id ? {
        ...it,
        quantity: quantityEdit
      } : it);

      yield put(
        updateQuantityCartSessionSuccess({
          cartSessions: newCartSessions
        })
      );

      sessionStorage.setItem("cartSessions", JSON.stringify(newCartSessions));
    }
  }
}

function* handleUpdateNoteCart() {
  while (true) {
    const {
      payload: { id, note },
    }: ReturnType<typeof updateNoteCartSessionAction> = yield take(updateNoteCartSessionAction);

    const { cartSessions }: CartSessionState = yield select(
      (state: RootState) => state.cartSession
    );

    const cartSession = cartSessions.find((it) => it.id === id);

    const newCartSessions = cartSessions.map((it) => it.id === id ? {
      ...it,
      note
    } : it);

    if (cartSession) {
      yield put(
        updateNoteCartSessionSuccess({
          cartSessions: newCartSessions
        })
      );
    }

    sessionStorage.setItem("cartSessions", JSON.stringify(newCartSessions));
  }
}

function* handleUpdateCheckedCart() {
  while (true) {
    const {
      payload: { id, checked },
    }: ReturnType<typeof updateCheckedCartSessionAction> = yield take(updateCheckedCartSessionAction);

    const { cartSessions }: CartSessionState = yield select(
      (state: RootState) => state.cartSession
    );

    const cartSession = cartSessions.find((it) => it.id === id);

    const newCartSessions = cartSessions.map((it) => it.id === id ? {
      ...it,
      checked
    } : it);

    if (cartSession) {
      yield put(
        updateCheckedCartSessionSuccess({
          cartSessions: newCartSessions
        })
      );
    }

    sessionStorage.setItem("cartSessions", JSON.stringify(newCartSessions));
  }
}

function* handleUpdateAllCheckedCart() {
  while (true) {
    yield take(updateAllCheckedCartSessionAction);

    const { cartSessions }: CartSessionState = yield select(
      (state: RootState) => state.cartSession
    )

    const checked = cartSessions.every((it) => it.checked);

    const newCartSessions = cartSessions.map((it) => ({
      ...it,
      checked: !checked
    }))

    yield put(
      updateAllCheckedCartSessionSuccess({
        cartSessions: newCartSessions,
      })
    );

    sessionStorage.setItem("cartSessions", JSON.stringify(newCartSessions));
  }
}

function* handleDeleteCart() {
  while (true) {
    const {
      payload: { id },
    }: ReturnType<typeof deleteCartSessionAction> = yield take(deleteCartSessionAction);

    const { cartSessions }: CartSessionState = yield select(
      (state: RootState) => state.cartSession
    );

    const newCartSessions = cartSessions.filter((it) => it.id !== id);

    yield put(deleteCartSessionSuccess({ cartSessions: newCartSessions }));

    sessionStorage.setItem("cartSessions", JSON.stringify(newCartSessions));
  }
}

function* handleDeleteAllCart() {
  while (true) {
    yield take(deleteAllCartSessionsAction);

    yield put(deleteAllCartSessionSuccess());

    sessionStorage.removeItem("cartSessions");
  }
}

export const cartSessionSagas = [
  fork(handleCreateCart),
  fork(handleUpdateQuantityCart),
  fork(handleUpdateNoteCart),
  fork(handleUpdateCheckedCart),
  fork(handleUpdateAllCheckedCart),
  fork(handleDeleteCart),
  fork(handleDeleteAllCart),
];
