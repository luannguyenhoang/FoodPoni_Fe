import { Order, OrderItem, Page } from "@/type/types";
import { groupOrderByUser } from "@/utils/common";
import { Card, Divider, List } from "antd";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { OrderSummary } from "../atoms/OrderSummaryProps";
import { OrderItemDetail } from "../organisms/OrderItemDetail";
import { OrderItemPricing } from "./OrderItemPricing";
import HeadTable from "./TableHead";

export const OrderGroupDetailCard = ({
  currentUserId,
  isFetchOrderItemsLoading,
  page,
  selectedOrder,
}: {
  currentUserId?: string;
  isFetchOrderItemsLoading: boolean;
  page: Page<Array<OrderItem>>;
  selectedOrder: Order;
}) => (
  <Card size="small" loading={isFetchOrderItemsLoading}>
    <HeadTable />
    <Divider className="my-4" />
    {groupOrderByUser(page.content).map((groupedItems) => (
      <div key={groupedItems.user.id} className="mb-4">
        <Card
          size="small"
          className={`hover:shadow-md transition-shadow duration-300 ${groupedItems.user.id !== currentUserId ? "opacity-50" : "border border-primary"}`}
          title={
            <AvatarInfo
              padding="py-2"
              avatar={groupedItems.user.avatar}
              fullName={groupedItems.user.username}
              info={`${groupedItems.items.length} sản phẩm`}
            />
          }
        >
          <List
            dataSource={groupedItems.items}
            renderItem={(item) => (
              <List.Item className="hover:bg-gray-50 transition-colors duration-200">
                <div
                  className={`grid grid-cols-10 py-3 px-6 w-full relative rounded-lg
                        `}
                >
                  <div className="col-span-5">
                    <OrderItemDetail
                      orderItem={item}
                      orderStatus={selectedOrder.status}
                    />
                  </div>
                  <div className="col-span-5">
                    <OrderItemPricing orderItem={item} />
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
        <Divider className="my-4" />
      </div>
    ))}
    <OrderSummary
      openButton={true}
      totalAmount={selectedOrder.totalAmount}
      shippingFee={selectedOrder.shippingFee}
      orderItems={page.content}
      orderStatus={selectedOrder.status}
    />
  </Card>
);
