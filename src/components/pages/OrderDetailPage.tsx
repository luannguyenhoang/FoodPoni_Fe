import { ProductLoading } from "@/components/atoms/ProductLoading.tsx";
import { fetchOrderByCustomerAction } from "@/redux/modules/order.ts";
import { RootState } from "@/redux/store";
import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Divider } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { OrderDetailCard } from "../molecules/OrderDetailCard.tsx";
import { OrderHeader } from "../molecules/OrderHeader.tsx";
import { OrderInfoCard } from "../molecules/OrderInfoCard.tsx";
import { ManagementLayout } from "../templates/ManagementLayout.tsx";
import { fetchOrderItemsByOrderIdAction } from "@/redux/modules/orderItem.ts";

export const OrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useDispatch();
  const { selectedOrder, isFetchLoading: isFetchOrderLoading } = useSelector(
    (state: RootState) => state.order
  );
  const { page, isFetchLoading: isFetchOrderItemsLoading } = useSelector(
    (state: RootState) => state.orderItem
  );

  useEffect(() => {
    if (orderId) {
      dispatch(
        fetchOrderItemsByOrderIdAction({
          oid: orderId,
          queryParams: { sort: ["createdAt,desc"] },
        })
      );
      dispatch(fetchOrderByCustomerAction({ orderId }));
    }
  }, [orderId, dispatch]);

  if (!selectedOrder || isFetchOrderLoading) {
    return (
      <ManagementLayout>
        <ProductLoading />
      </ManagementLayout>
    );
  }

  return (
    <ManagementLayout>
      <Link to="/don-hang" className="inline-block mb-4">
        <Button
          type="link"
          icon={<LeftOutlined />}
          className="text-orange-600 hover:text-orange-400"
        >
          Quay lại đơn hàng của tôi
        </Button>
      </Link>
      <div className="container mx-auto">
        <Card className="shadow-lg">
          <OrderHeader
            orderId={selectedOrder.id}
            status={selectedOrder.status}
          />
          <Divider />
          <OrderInfoCard selectedOrder={selectedOrder} />
          <Divider />
          <OrderDetailCard
            isFetchOrderItemsLoading={isFetchOrderItemsLoading}
            page={page}
            selectedOrder={selectedOrder}
          />
        </Card>
        <Link to="/don-hang" className="inline-block mt-6">
          <Button
            type="link"
            icon={<LeftOutlined />}
            className="text-orange-600 hover:text-orange-400"
          >
            Quay lại đơn hàng của tôi
          </Button>
        </Link>
      </div>
    </ManagementLayout>
  );
};
