import { Order, Page } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";

export const getOrdersPageByCustomer = (
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(generateQueryString("/customer/orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const getOrdersPageByRetailer = (
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(generateQueryString("/retailer/orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const getOrderByCustomer = (oid: string): Promise<Order> => {
  return apiWithToken()
    .get(generateQueryString(`/customer/orders/${oid}`), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Order>) => res.data);
};

export const getOrderByRetailer = (oid: string): Promise<Order> => {
  return apiWithToken()
    .get(generateQueryString(`/retailer/orders/${oid}`), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Order>) => res.data);
};

export const getOrdersPageByStatus = (
  status: string,
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(
      generateQueryString(`/customer/orders/status/${status}`, queryParams),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const getPostPaidOrders = (
  ppid: string,
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(
      generateQueryString(`/customer/orders-post-paid/${ppid}`, queryParams),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const getPostPaidOrdersByRetailer = (
  ppid: string,
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(
      generateQueryString(`/retailer/orders-post-paid/${ppid}`, queryParams),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const getRefundPageByRetailer = (
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(generateQueryString("retailer/orders-refunding", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const createOrderByCashOrPostPaid = (
  addressId: string,
  note: string,
  postPaid?: boolean,
  roomId?: string
): Promise<string> => {
  let url;
  if (postPaid) {
    url = roomId ? "/orders-group/post-paid" : "/orders/post-paid";
  } else {
    url = roomId ? "/orders-group" : "/orders";
  }

  return apiWithToken()
    .post(
      url,
      { addressId, note, roomId },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

export const createOrderByVNPay = (
  addressId: string,
  note: string,
  roomId?: string
): Promise<string> => {
  const url = roomId ? "/orders-group/vnpay" : "/orders/vnpay";

  return apiWithToken()
    .post(
      url,
      { addressId, note, roomId },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

export const createOrderByPostPaid = (
  addressId: string,
  note: string,
  orderGroup: boolean
): Promise<string> => {
  const url = orderGroup ? "/orders-group/post-paid" : "/orders/post-paid";

  return apiWithToken()
    .post(
      url,
      { addressId, note },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

export const updateStatus = (
  oid: string,
  orderStatus: string
): Promise<void> => {
  return apiWithToken()
    .patch(
      generateQueryString(`/retailer/orders/${oid}`, {
        status: orderStatus,
      }),
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};

export const refund = (oid: string): Promise<void> => {
  return apiWithToken()
    .patch(
      generateQueryString(`/customer/orders/refund/${oid}`),
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};

export const refundConfirmationrefund = (oid: string): Promise<void> => {
  return apiWithToken()
    .patch(
      generateQueryString(`/retailer/orders/confirm-refund/${oid}`),
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};

export const CancelOrder = (
  oid: string,
  queryParams: QueryParams
): Promise<void> => {
  return apiWithToken()
    .patch(
      generateQueryString(`/customer/orders/${oid}`, queryParams),
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};
