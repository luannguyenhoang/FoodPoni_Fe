import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store.ts";
import { Button, Modal } from "antd";
import { updateVisible } from "@/redux/modules/cartGroup.ts";
import { CartGroupHome } from "@/components/organisms/CartGroupHome";
import { CartGroupDetail } from "@/components/organisms/CartGroupDetail";

export function CartGroup() {
  const dispatch = useDispatch();
  const {
    isVisible,
    windowSelected,
    cartGroupsJoined,
    cartGroupSelected,
    fetchingCartGroupsLoading,
    creatingCartGroupLoading,
  } = useSelector((state: RootState) => state.cartGroup);
  const { isCreateLoading } = useSelector((state: RootState) => state.order);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  if (!currentUser || currentUser.role === "RETAILER") return null;

  return (
    <>
      <Button
        loading={fetchingCartGroupsLoading}
        onClick={() => dispatch(updateVisible({ isVisible: true }))}
        className="fixed bottom-10 right-6 text-[18px] inline-flex h-12 animate-shimmer items-center justify-center rounded-full border border-white bg-[linear-gradient(110deg,#F36F24,45%,#ff9f5a,55%,#F36F24)] bg-[length:200%_100%] px-8 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-orange-50"
      >
        <span className="text-[35px]">✨</span>Tạo đơn hàng nhóm
      </Button>
      <Modal
        className="relative"
        title="Group Order"
        open={isVisible}
        onCancel={() => dispatch(updateVisible({ isVisible: false }))}
        footer={null}
        centered
        width={1000}
      >
        {windowSelected === "HOME" && (
          <CartGroupHome currentUserId={currentUser.id} />
        )}
        {cartGroupsJoined.length > 0 && windowSelected === "CART_GROUP" && (
          <CartGroupDetail
            cartGroupsJoined={cartGroupsJoined}
            cartGroupSelected={cartGroupSelected}
            creatingCartGroupLoading={creatingCartGroupLoading}
            currentUser={currentUser}
            isCreateLoading={isCreateLoading}
          />
        )}
      </Modal>
    </>
  );
}
