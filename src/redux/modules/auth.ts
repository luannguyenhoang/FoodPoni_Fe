import {createSlice} from "@reduxjs/toolkit";
import {AuthRequest, AuthResponse, CurrentUser, UserRemember} from "@/type/types.ts";
import {call, fork, put, select, take} from "redux-saga/effects";
import {notification} from "antd";
import {FieldLoginType} from "@/app/modules/auth/components/login.tsx";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import {REFRESH_TOKEN, REMEMBER_ME} from "@/utils/server.ts";
import {login} from "@/utils/api/auth.ts";
import {RootState} from "@/redux/store.ts";

export type AuthState = {
    readonly login: {
        readonly username: string,
        readonly password: string,
        readonly remember: boolean,
        readonly rememberMe: UserRemember,
        readonly isPending: boolean,
    },
    readonly currentUser: CurrentUser,
}

const initialState: AuthState = {
    login: {
        username: "",
        password: "",
        remember: true,
        rememberMe: {
            username: "",
            password: "",
            avatar: "",
        },
        isPending: false,
    },
    currentUser: {
        id: "",
        sub: "",
        role: "",
        avatar: "",
        addressId: "",
        username: "",
        email: ""
    }
};

const SLIDE_NAME = 'auth';

const cartSlide = createSlice({
    name: SLIDE_NAME,
    initialState,
    reducers: {
        loginRequest: (state) => ({
            ...state,
            login: {
                ...state.login,
                isPending: true
            }
        }),
        loginSuccess: (state) => ({
            ...state,
            login: {
                ...state.login,
                isPending: false
            }
        }),
        loginFailure: (state) => ({
            ...state,
            login: {
                ...state.login,
                isPending: false
            }
        }),
        updateUsername: (state, action: { payload: string }) => ({
            ...state,
            login: {
                ...state.login,
                username: action.payload
            }
        }),
        updatePassword: (state, action: { payload: string }) => ({
            ...state,
            login: {
                ...state.login,
                password: action.payload
            }
        }),
        rememberMeRequest: (state, action: { payload: boolean }) => ({
            ...state,
            login: {
                ...state.login,
                remember: action.payload
            }
        }),
        updateRememberMe: (state, action: { payload: UserRemember }) => ({
            ...state,
            login: {
                ...state.login,
                rememberMe: action.payload
            }
        }),
        updateCurrentUser: (state, action: { payload: CurrentUser }) => ({
            ...state,
            currentUser: action.payload
        }),
        clearCurrentUser: (state) => ({
            ...state,
            currentUser: initialState.currentUser
        })
    }
});

export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    updateUsername,
    updatePassword,
    rememberMeRequest,
    updateRememberMe,
    updateCurrentUser,
    clearCurrentUser,
} = cartSlide.actions;
export default cartSlide.reducer;

function* handleLogin() {
    while (true) {
        yield take(loginRequest.type);
        try {
            const payload: FieldLoginType = yield select((state: RootState) => state.auth.login);
            const user: AuthRequest = {
                username: payload.username,
                password: payload.password
            };
            const res: AuthResponse = yield call(login, user);

            yield put(loginSuccess());
            yield put(updateCurrentUser(jwtDecode(res.refreshToken) as CurrentUser));

            Cookies.set(REFRESH_TOKEN, res.refreshToken, {expires: 7});
            Cookies.remove(REMEMBER_ME);

            if (payload.remember) {
                const userRemember: UserRemember = {
                    username: user.username ? user.username! : user.email!,
                    password: user.password,
                    avatar: "currentUser.avatar"
                }
                yield put(updateRememberMe(userRemember));
                Cookies.set(REMEMBER_ME, btoa(JSON.stringify(userRemember)), {expires: 7});
            } else Cookies.remove(REMEMBER_ME);
        } catch (e) {
            notification.open({
                type: 'error',
                message: 'Đăng nhập',
                description: e.message,
            });
            yield put(loginFailure());
        }
    }
}

export const authSagas = [fork(handleLogin),];