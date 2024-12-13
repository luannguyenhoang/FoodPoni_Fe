import { fetchOrderItemsByAnonymousAction } from "@/redux/modules/orderItem";
import "antd-button-color/dist/css/style.css";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { InvoiceContent } from "../organisms/InvoiceModal";
import { DefaultLayout } from "../templates/DefaultLayout";
import "./AdminOrderTablePage.scss";
import { fetchOrderSessionAction } from "@/redux/modules/order";

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const AnonymousOrderPage = () => {
  const dispatch = useDispatch();
  const { orderId } = useParams<{ orderId: string }>();

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderSessionAction({ orderId: orderId }));
      dispatch(
        fetchOrderItemsByAnonymousAction({ oid: orderId, queryParams: {} })
      );
    }
  }, [orderId, dispatch]);

  return (
    <DefaultLayout>
      <InvoiceContent />
    </DefaultLayout>
  );
};
