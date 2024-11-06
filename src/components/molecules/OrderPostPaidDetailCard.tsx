import { Order, OrderItem, Page } from "@/type/types";
import { Card, Divider, List } from "antd";
import { OrderSummary } from "../atoms/OrderSummaryProps";
import { OrderItemDetail } from "../organisms/OrderItemDetail";
import { OrderItemPricing } from "./OrderItemPricing";
import HeadTable from "./TableHead";

export const OrderPostPaidDetailCard = ({
  isFetchOrderItemsLoading,
  page,
  selectedOrder,
}: {
  isFetchOrderItemsLoading: boolean;
  page: Page<Array<OrderItem>>;
  selectedOrder: Order;
}) => (
  <Card size="small" loading={isFetchOrderItemsLoading}>
    <HeadTable />
    <Divider />
    <List
      dataSource={page.content}
      renderItem={(it) => (
        <List.Item className="flex justify-between items-center">
          <div className="grid grid-cols-10 px-5 cursor-pointer w-full">
            <div className="col-span-5">
              <OrderItemDetail
                orderItem={it}
                orderStatus={selectedOrder.status}
              />
            </div>
            <div className="col-span-5">
              <OrderItemPricing orderItem={it} />
            </div>
          </div>
        </List.Item>
      )}
    />
    <Divider />
    <OrderSummary
      totalAmount={selectedOrder.totalAmount}
      shippingFee={selectedOrder.shippingFee}
      orderItems={page.content}
      orderStatus={selectedOrder.status}
    />
  </Card>
);