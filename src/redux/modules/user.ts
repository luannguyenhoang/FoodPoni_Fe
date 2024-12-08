import { UserFormState } from "@/components/molecules/UserForm";
import { Page, User } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common";

import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";
import { getUserById, getUserPage, updateAvatarUser, updateUser } from "@/utils/api/user";

export type UserState = {
  readonly page: Page<User[]>;
  readonly selectedUser: User;
  readonly isFetchLoading: boolean;
  readonly isCreateLoading: boolean;
  readonly isUpdateLoading: boolean;
};

const initialState: UserState = {
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
  selectedUser: {} as User,
  isFetchLoading: false,
  isCreateLoading: false,
  isUpdateLoading: false,
};

const SLICE_NAME = "user";

const UserSlide = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    updateFetchLoadingSuccess: (state) => ({
      ...state,
      isFetchLoading: true,
    }),
    fetchUsersSuccess: (state, { payload }: { payload: Page<User[]> }) => ({
      ...state,
      page: payload,
      isFetchLoading: false,
    }),
    fetchUsersFailure: (state) => ({
      ...state,
      isFetchLoading: false,
    }),
    updateLoadingForUserUpdate: (state) => ({
      ...state,
      isUpdateLoading: true,
    }),
    updateUserSuccess: (state) => ({
      ...state,
      isUpdateLoading: false,
      selectedUser: {} as User,
    }),
    updateUserFailure: (state) => ({
      ...state,
      isUpdateLoading: false,
    }),
    getUserByIdSuccess: (state, action: PayloadAction<{ user: User }>) => ({
      ...state,
      selectedUser: action.payload.user,
      isFetchLoading: false,
    }),
    getUserByIdFailure: (state) => ({
      ...state,
      selectedUser: {} as User,
      isFetchLoading: false,
    }),
  },
});
export default UserSlide.reducer;

export const fetchUsersAction = createAction<{ queryParams: QueryParams }>(
  `${SLICE_NAME}/fetchToppingsRequest`
);

export const fetchUserByIdAction = createAction<{ uid: string }>(
  `${SLICE_NAME}/fetchUserByIdRequest`
);
export const updateUserAction = createAction<{
  user: UserFormState;
  resetForm: () => void;
}>(`${SLICE_NAME}/updateUserRequest`);

export const {
  updateFetchLoadingSuccess,
  fetchUsersSuccess,
  fetchUsersFailure,
  updateLoadingForUserUpdate,
  updateUserSuccess,
  updateUserFailure,
  getUserByIdSuccess,
  getUserByIdFailure,
} = UserSlide.actions;

function* handleFetchUsers() {
  while (true) {
    const {
      payload: { queryParams },
    }: ReturnType<typeof fetchUsersAction> = yield take(fetchUsersAction);
    try {
      yield put(updateFetchLoadingSuccess());
      const page: Page<User[]> = yield call(getUserPage, queryParams);
      yield put(fetchUsersSuccess(page));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(fetchUsersFailure());
    }
  }
}

function* handleUpdateUser() {
  while (true) {
    const { payload }: ReturnType<typeof updateUserAction> =
      yield take(updateUserAction);
    try {
      yield put(updateLoadingForUserUpdate());
      yield call(updateUser, payload.user);
      yield call(updateAvatarUser, payload.user.avatar);
      yield put(updateUserSuccess());
      yield put(fetchUserByIdAction({ uid: payload.user.id }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateUserFailure());
    }
  }
}

function* handleGetUserById() {
  while (true) {
    const {
      payload: { uid },
    }: ReturnType<typeof fetchUserByIdAction> = yield take(fetchUserByIdAction);
    try {
      yield put(updateFetchLoadingSuccess());
      const user: User = yield call(getUserById, uid);
      yield put(getUserByIdSuccess({ user }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(getUserByIdFailure());
    }
  }
}

export const userSagas = [
  fork(handleFetchUsers),
  fork(handleUpdateUser),
  fork(handleGetUserById),
];
