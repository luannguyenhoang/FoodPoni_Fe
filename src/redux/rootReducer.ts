import addressReducer from "@/redux/modules/address.ts";
import authReducer from "@/redux/modules/auth.ts";
import cartReducer from "@/redux/modules/cart.ts";
import cartSessionReducer from "@/redux/modules/cartSession.ts";
import cartGroupReducer from "@/redux/modules/cartGroup.ts";
import fileUploadsReducer from "@/redux/modules/fileUploads.ts";
import notificationReducer from "@/redux/modules/notification.ts";
import orderReducer from "@/redux/modules/order.ts";
import orderSessionReducer from "@/redux/modules/orderSession.ts";
import orderItemReducer from "@/redux/modules/orderItem.ts";
import productReducer from "@/redux/modules/product.ts";
import productDetailReducer from "@/redux/modules/productDetail.ts";
import productCategoryReducer from "@/redux/modules/productCategory.ts";
import postpaidReducer from "@/redux/modules/postpaid.ts";
import rateReducer from "@/redux/modules/rate.ts";
import toppingReducer from "@/redux/modules/topping.ts";
import invoiceReducer from "@/redux/modules/invoice.ts";
import userReducer from "@/redux/modules/user.ts";
import messageReducer from "@/redux/modules/message.ts";
import statisticReducer from "@/redux/modules/statistic.ts";
import { combineReducers } from "@reduxjs/toolkit";

export const rootReducer = combineReducers({
  address: addressReducer,
  auth: authReducer,
  cart: cartReducer,
  cartSession: cartSessionReducer,
  fileUpload: fileUploadsReducer,
  user: userReducer,
  invoice: invoiceReducer,
  statistic:statisticReducer,
  message: messageReducer,
  order: orderReducer,
  orderItem: orderItemReducer,
  orderSession: orderSessionReducer,
  cartGroup: cartGroupReducer,
  notification: notificationReducer,
  product: productReducer,
  productDetail: productDetailReducer,
  productCategory: productCategoryReducer,
  postpaid: postpaidReducer,
  rate: rateReducer,
  topping: toppingReducer,
});
