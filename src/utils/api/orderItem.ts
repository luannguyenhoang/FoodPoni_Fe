import { OrderItem, Page } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";

export const getOrderItemsPageByCustomer = (
  oid: string,
  queryParams: QueryParams
): Promise<Page<OrderItem[]>> => {
  return apiWithToken()
    .get(
      generateQueryString(`/customer/order-items/orders/${oid}`, queryParams),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<Page<OrderItem[]>>) => res.data);
};

export const getOrderItemsPageByAnonymous = (
  oid: string,
  queryParams: QueryParams
): Promise<Page<OrderItem[]>> => {
  return apiWithToken()
    .get(
      generateQueryString(`/customer/walk-in-guest/order-items/orders/${oid}`, queryParams)
    )
    .then((res: AxiosResponse<Page<OrderItem[]>>) => res.data);
};
