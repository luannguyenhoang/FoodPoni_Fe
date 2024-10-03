import {all} from 'redux-saga/effects'
import {notificationSagas} from "@/redux/modules/notification.ts";
import {authSagas} from "@/redux/modules/auth.ts";
import {productSagas} from "@/redux/modules/product.ts";
import {cartSagas} from "@/redux/modules/cart.ts";
import {productCategorySagas} from "@/redux/modules/productCategory.ts";
import {orderSagas} from './modules/order';

export default function* rootSaga() {
    yield all([
        ...authSagas,
        ...cartSagas,
        ...notificationSagas,
        ...productSagas,
        ...productCategorySagas,
        ...orderSagas
    ])
}