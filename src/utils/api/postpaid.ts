import { Order, Page } from "@/type/types.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";

export const getPostPaidByRetailerPage = (
  queryParams: QueryParams
): Promise<Page<Order[]>> => {
  return apiWithToken()
    .get(generateQueryString("/retailer/postpaid-orders", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Order[]>>) => res.data);
};

export const confirmationPosPaid = (ppid: string): Promise<void> => {
  return apiWithToken()
    .post(
      generateQueryString(`/retailer/postpaid-order/${ppid}`),
      {},
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};
