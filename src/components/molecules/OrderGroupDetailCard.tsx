import { Order, OrderItem, Page } from "@/type/types";
import { currencyFormat, groupOrderByUser } from "@/utils/common";
import { Card, Divider, Table } from "antd";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { OrderSummary } from "../atoms/OrderSummaryProps";
import { OrderItemDetail } from "../organisms/OrderItemDetail";

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
            dataSource={groupedItems.items.map((it, index) => ({
              ...it,
              no: index + 1,
              name: (
                <>
                  <AvatarInfo
                    fullName={
                      it.productDetail.product.name +
                      " - " +
                      it.productDetail.name
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
                    disable={groupedItems.user.id !== currentUserId}
                    orderItem={it}
                    orderStatus={selectedOrder.status}
                  />
                </>
              ),
              price: currencyFormat(
                it.price + it.toppings.reduce((sum, tp) => sum + tp.price, 0)
              ),
              total: currencyFormat(
                (it.price +
                  it.toppings.reduce((sum, tp) => sum + tp.price, 0)) *
                  it.quantity
              ),
              note: it.note,
            }))}
            pagination={false}
          />
        </Card>
        <Divider className="my-4" />
      </div>
    ))}
    <OrderSummary
      openButton={false}
      totalAmount={selectedOrder.totalAmount}
      shippingFee={selectedOrder.shippingFee}
      orderItems={page.content}
      orderStatus={selectedOrder.status}
    />
  </Card>
);
