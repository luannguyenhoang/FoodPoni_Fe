import {
  deleteAllCartRequest,
  updateAllCheckedRequest,
} from "@/redux/modules/cart.ts";
import { RootState } from "@/redux/store.ts";
import { useDispatch, useSelector } from "react-redux";
import { CartBody } from "../molecules/CartBody.tsx";
import { CartHeader } from "../molecules/CartHeader.tsx";
import { CurrentUser } from "@/type/types.ts";
import {
  deleteAllCartSessionsAction,
  updateAllCheckedCartSessionAction,
} from "@/redux/modules/cartSession.ts";

export const CartItems = ({
  currentUser,
}: {
  currentUser?: CurrentUser | null;
}) => {
  const dispatch = useDispatch();

  const {
    page,
    isFetchLoading,
    isAllChecked,
    isDeleteAllLoading,
    isCheckAllLoading,
  } = useSelector((state: RootState) => state.cart);

  const { cartSessions } = useSelector((state: RootState) => state.cartSession);

  return (
    <div className="w-full">
      <CartHeader
        enableCartGroup={false}
        enableDeleteAll={
          (currentUser ? page.content.length : cartSessions.length) > 0
        }
        isAllChecked={currentUser? isAllChecked: cartSessions.every((cart) => cart.checked)}
        isDeleteAllLoading={isDeleteAllLoading}
        isCheckAllLoading={isCheckAllLoading}
        isDisableCheckbox={
          (currentUser ? page.content.length : cartSessions.length) < 1
        }
        updateAllCheckedRequest={() =>
          dispatch(
            currentUser
              ? updateAllCheckedRequest()
              : updateAllCheckedCartSessionAction()
          )
        }
        deleteAllCartRequest={() =>
          dispatch(
            currentUser ? deleteAllCartRequest() : deleteAllCartSessionsAction()
          )
        }
      />
      <CartBody
        isFetchLoading={isFetchLoading}
        enableCartGroup={false}
        carts={currentUser ? page.content : cartSessions}
        currentUserId={currentUser && currentUser.id}
      />
    </div>
  );
};
