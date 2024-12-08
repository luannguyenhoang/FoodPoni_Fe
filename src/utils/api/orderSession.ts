import { CartSessionState } from "@/redux/modules/cartSession";
import { AxiosResponse } from "axios";
import { api } from "../axiosConfig";
import { OrderSessionRequest } from "@/components/molecules/OrderSessionForm";

export const createOrderSession = (
  cartSessions: CartSessionState["cartSessions"],
  values: OrderSessionRequest
): Promise<string> => {
  return api
    .post("/orders/walk-in-guest", {
      cartCreationRequestDTOS: cartSessions.map((it) => (
        {
          productDetailId: it.productDetail.id,
          toppings: it.toppings.map((it) => it.id),
          type: it.type,
          quantity: it.quantity,
        }
      )),
      addressCreationRequestDTO: {
        ...values,
        note: undefined,
      },
      note: values.note,
    })
    .then((res: AxiosResponse<string>) => res.data);
};
