import { fetchOrderSessionAction } from "@/redux/modules/order";
import { fetchOrderItemsByAnonymousAction } from "@/redux/modules/orderItem";
import { RootState } from "@/redux/store";
import { Spin, Steps } from "antd";
import "antd-button-color/dist/css/style.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { InvoiceContent } from "../organisms/InvoiceModal";
import { DefaultLayout } from "../templates/DefaultLayout";
import "./AdminOrderTablePage.scss";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const AnonymousOrderPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams<{ orderId: string }>();
  const { selectedOrder, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderSessionAction({ orderId: orderId }));
      dispatch(
        fetchOrderItemsByAnonymousAction({ oid: orderId, queryParams: {} })
      );
    }
  }, [orderId, dispatch]);

  const currentStatus = selectedOrder?.status;
  const currentStep =
    currentStatus === "PENDING"
      ? 0
      : currentStatus === "APPROVED"
        ? 1
        : currentStatus === "DELIVERING"
          ? 2
          : currentStatus === "COMPLETED"
            ? 3
            : undefined;

  return (
    <DefaultLayout>
      {isFetchLoading ? (
        <Spin className="w-full flex justify-center mb-2" />
      ) : (
        <Steps
          className="my-2"
          size="small"
          current={currentStep}
          items={[
            {
              title: "Chờ xác nhận",
            },
            {
              title: "Đang chế biến",
            },
            {
              title: "Đang giao",
            },
            {
              title: "Đã nhận hàng",
            },
          ]}
        />
      )}
      <InvoiceContent />
    </DefaultLayout>
  );
};
