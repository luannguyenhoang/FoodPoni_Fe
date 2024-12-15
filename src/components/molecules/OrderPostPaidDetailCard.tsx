import { Order, OrderItem, Page } from "@/type/types";
import { currencyFormat } from "@/utils/common";
import { Card, Table } from "antd";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { OrderSummary } from "../atoms/OrderSummaryProps";
import { OrderItemDetail } from "../organisms/OrderItemDetail";

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
    <Table
      size="small"
      loading={isFetchOrderItemsLoading}
      scroll={{ x: "max-content" }}
      columns={[
        {
          title: "STT",
          dataIndex: "no",
        },
        {
          title: "Tên món ăn",
          dataIndex: "name",
        },
        {
          title: "Số lượng",
          dataIndex: "quantity",
        },
        {
          title: "Đơn giá",
          dataIndex: "price",
        },
        {
          title: "Thành tiền",
          dataIndex: "total",
        },
        {
          title: "Ghi chú",
          dataIndex: "note",
        },
      ]}
      dataSource={page.content.map((it, index) => ({
        ...it,
        no: index + 1,
        name: (
          <>
            <AvatarInfo
              fullName={
                it.productDetail.product.name + " - " + it.productDetail.name
              }
              info={it.toppings.map((topping) => topping.name).join(", ")}
              avatar={it.productDetail.images[0]}
            />
            <OrderItemDetail
              orderItem={it}
              orderStatus={selectedOrder.status}
            />
          </>
        ),
        price: currencyFormat(
          it.price + it.toppings.reduce((sum, tp) => sum + tp.price, 0)
        ),
        total: currencyFormat(
          (it.price + it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
            it.quantity
        ),
        note: it.note,
      }))}
      pagination={false}
    />

    <OrderSummary
      openButton={false}
      totalAmount={selectedOrder.totalAmount}
      shippingFee={selectedOrder.shippingFee}
      orderItems={page.content}
      orderStatus={selectedOrder.status}
    />
  </Card>
);
