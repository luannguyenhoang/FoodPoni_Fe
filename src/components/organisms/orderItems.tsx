import {
  deleteAllCartRequest,
  updateAllCheckedRequest,
} from "@/redux/modules/cart.ts";
import { RootState } from "@/redux/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { CartBody } from "../molecules/cartBody.tsx";
import { CartHeader } from "../molecules/cartHeader.tsx";

export default function OrderItems() {
  const dispatch = useDispatch();

  const { page, isFetchLoading, isAllChecked, isDeleteAllLoading } =
    useSelector((state: RootState) => state.cart);

  return (
    <div>
      <CartHeader
        enableCartGroup={false}
        isAllChecked={isAllChecked}
        isDeleteAllLoading={isDeleteAllLoading}
        isDisableCheckbox={page.content.length < 1}
        updateAllCheckedRequest={() => dispatch(updateAllCheckedRequest())}
        deleteAllCartRequest={() => dispatch(deleteAllCartRequest())}
      />
      <CartBody
        isFetchLoading={isFetchLoading}
        enableCartGroup={false}
        carts={page.content}
      />
    </div>
  );
}
