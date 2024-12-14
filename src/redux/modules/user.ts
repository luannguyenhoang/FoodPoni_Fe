import { UserFormState } from "@/components/molecules/UserForm";
import { Page, User } from "@/type/types.ts";
import { QueryParams } from "@/utils/api/common";

import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { call, fork, put, take } from "redux-saga/effects";
import { addMessageSuccess } from "./message";
import {
  getUserById,
  getUserPage,
  updateAvatarUser,
  updateRole,
  updateUser,
} from "@/utils/api/user";

export type UserState = {
  readonly page: Page<Array<User & { isUpdateRoleLoading?: boolean }>>;
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
    updateLoadingForUpdatingRoleSuccess: (
      state,
      action: PayloadAction<{ id: string }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((user) => {
          if (user.id === action.payload.id) {
            return {
              ...user,
              isUpdateRoleLoading: true,
            };
          }
          return user;
        }),
      },
    }),
    updateRoleSuccess: (
      state,
      action: PayloadAction<{ id: string; role: "VIP" | "CUSTOMER" }>
    ) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((user) => {
          if (user.id === action.payload.id) {
            return {
              ...user,
              role: action.payload.role,
              isUpdateRoleLoading: false,
            };
          }
          return user;
        }),
      },
    }),
    updateRoleFailure: (state, action: PayloadAction<{ id: string }>) => ({
      ...state,
      page: {
        ...state.page,
        content: state.page.content.map((user) => {
          if (user.id === action.payload.id) {
            return {
              ...user,
              isUpdateRoleLoading: false,
            };
          }
          return user;
        }),
      },
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

export const updateRoleAction = createAction<{
  id: string;
  role: "VIP" | "CUSTOMER";
}>(`${SLICE_NAME}/updateRoleRequest`);

export const {
  updateFetchLoadingSuccess,
  fetchUsersSuccess,
  fetchUsersFailure,
  updateLoadingForUserUpdate,
  updateUserSuccess,
  updateUserFailure,
  getUserByIdSuccess,
  getUserByIdFailure,
  updateLoadingForUpdatingRoleSuccess,
  updateRoleSuccess,
  updateRoleFailure,
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

function* handleUpdateRole() {
  while (true) {
    const {
      payload: { id, role },
    }: ReturnType<typeof updateRoleAction> = yield take(updateRoleAction);
    try {
      yield put(updateLoadingForUpdatingRoleSuccess({ id }));
      yield call(updateRole, id, role);
      yield put(updateRoleSuccess({ id, role }));
    } catch (e) {
      yield put(addMessageSuccess({ error: e }));
      yield put(updateRoleFailure({ id }));
    }
  }
}

export const userSagas = [
  fork(handleFetchUsers),
  fork(handleUpdateUser),
  fork(handleGetUserById),
  fork(handleUpdateRole),
];
