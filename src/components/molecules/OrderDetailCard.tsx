import { Order, OrderItem, Page } from "@/type/types";
import { currencyFormat } from "@/utils/common";
import { Card, Table } from "antd";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { OrderSummary } from "../atoms/OrderSummaryProps";
import { OrderItemDetail } from "../organisms/OrderItemDetail";

export const OrderDetailCard = ({
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
          width: 50,
        },
        {
          title: "Tên món ăn",
          dataIndex: "name",
          width: 300,
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
        key: index,
        no: index + 1,
        name: (
          <>
            <AvatarInfo
              fullName={
                it.productDetail.product.name + " - " + it.productDetail.name
              }
              info={
                <div>
                  <div>{currencyFormat(it.productDetail.price)}</div>
                  {it.type && (
                    <div className="text-[10px]">
                      Loại:{" "}
                      <span className="bg-primary text-white rounded-lg mr-1 px-1">
                        {it.type}
                      </span>
                    </div>
                  )}
                  {it.toppings.map((tp, tpIndex) => (
                    <div
                      key={tpIndex}
                      className="text-[10px] inline-block bg-primary text-white rounded-lg mr-1 px-1 mb-1"
                    >
                      {tp.name}: {currencyFormat(tp.price)}
                    </div>
                  ))}
                </div>
              }
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
      openButton={true}
      totalAmount={selectedOrder.totalAmount}
      shippingFee={selectedOrder.shippingFee}
      orderItems={page.content}
      orderStatus={selectedOrder.status}
    />
  </Card>
);
