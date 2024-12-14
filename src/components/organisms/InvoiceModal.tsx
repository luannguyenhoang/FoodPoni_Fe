import { ScrollPane } from "@/components/atoms/ScrollPane.tsx";
import { fetchOrderByRetailerAction } from "@/redux/modules/order";
import { fetchOrderItemsByOrderIdAction } from "@/redux/modules/orderItem";
import { RootState } from "@/redux/store";
import { currencyFormat } from "@/utils/common";
import { EyeOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, Table, Tooltip } from "antd";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { OrderSummary } from "../atoms/OrderSummaryProps";

export const InvoiceModal = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="small"
        icon={<EyeOutlined />}
        onClick={() => {
          setIsModalOpen(true);
          dispatch(fetchOrderByRetailerAction({ orderId: id }));
          dispatch(
            fetchOrderItemsByOrderIdAction({ oid: id, queryParams: {} })
          );
        }}
      />
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <InvoiceContent maxHeight="600px" />
      </Modal>
    </>
  );
};

export const InvoiceContent = ({ maxHeight }: { maxHeight?: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { isFetchLoading: isFetchOrderLoading, selectedOrder } = useSelector(
    (state: RootState) => state.order
  );
  const { isFetchLoading: isFetchOrderItemLoading, page } = useSelector(
    (state: RootState) => state.orderItem
  );

  return (
    <Spin spinning={isFetchOrderLoading}>
      <ScrollPane maxHeight={`max-h-[${maxHeight}]`}>
        <div
          className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8"
          ref={ref}
        >
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <img
                src="/logo-02.png"
                alt="Company Logo"
                className="h-16 w-auto mr-4"
              />
              <div>
                <div className="text-2xl font-bold">
                  {selectedOrder?.status !== "COMPLETED"
                    ? "Đơn hàng"
                    : "Hóa đơn"}
                </div>
                <p className="text-gray-600">
                  {selectedOrder?.status !== "COMPLETED"
                    ? "Đơn hàng "
                    : "Hóa đơn "}
                  #{selectedOrder?.id.substring(0, 7).toUpperCase()}
                </p>
              </div>
            </div>
            <div>
              <p className="text-gray-600">
                Tạo lúc:{" "}
                <span className="font-semibold">
                  {selectedOrder &&
                    selectedOrder.createdAt &&
                    format(
                      new Date(selectedOrder.createdAt),
                      "HH:mm:ss - dd/MM/yyyy"
                    )}
                </span>
              </p>
              {selectedOrder?.status === "COMPLETED" && (
                <p className="text-gray-600">
                  Giao lúc:{" "}
                  <span className="font-semibold">
                    {selectedOrder &&
                      selectedOrder.status === "COMPLETED" &&
                      format(
                        new Date(selectedOrder.updatedAt),
                        "HH:mm:ss - dd/MM/yyyy"
                      )}
                  </span>
                </p>
              )}
            </div>
          </header>

          <section className="mb-6">
            <h2 className="text-xl font-semibold">Gửi đến:</h2>
            <p className="text-gray-600">
              {selectedOrder?.shippingAddress.fullName}
            </p>
            <p className="text-gray-600">
              {selectedOrder?.shippingAddress.address}
            </p>
            <p className="text-gray-600">
              Khoảng cách:{" "}
              {selectedOrder && selectedOrder.shippingAddress.distance / 1000}{" "}
              km
            </p>
            <p className="text-gray-600">
              Số diện thoại: {selectedOrder?.shippingAddress.phoneNumber}
            </p>
            {selectedOrder?.note && (
              <p className="text-gray-600">Ghi chú: {selectedOrder?.note}</p>
            )}
          </section>

          <Table
            size="small"
            loading={isFetchOrderItemLoading}
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
                <AvatarInfo
                  fullName={
                    it.productDetail.product.name +
                    " - " +
                    it.productDetail.name
                  }
                  info={it.toppings.map((topping) => topping.name).join(", ")}
                  avatar={it.productDetail.images[0]}
                />
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
          {selectedOrder && (
            <OrderSummary
              openButton={false}
              totalAmount={selectedOrder.totalAmount}
              shippingFee={selectedOrder.shippingFee}
              orderItems={page.content}
              orderStatus={selectedOrder.status}
            />
          )}

          <div className="mt-6 flex justify-between">
            <p className="text-gray-600">Cảm ơn bạn đã lựa chọn FoodPoni!</p>
            <Tooltip title="Xuất hóa đơn PDF">
              <FilePdfOutlined
                onClick={() => {
                  if (selectedOrder && ref.current) {
                    html2canvas(ref.current, { backgroundColor: null }).then(
                      (canvas) => {
                        const imgData = canvas.toDataURL("image/png", 1.0);
                        const pdf = new jsPDF("p", "mm", "a5");
                        const width = pdf.internal.pageSize.getWidth();
                        pdf.addImage(imgData, "PNG", 0, 0, width, 0);
                        pdf.save(
                          `HD-${selectedOrder.id.substring(0, 7).toUpperCase()}.pdf`
                        );
                      }
                    );
                  }
                }}
              />
            </Tooltip>
          </div>
        </div>
      </ScrollPane>
    </Spin>
  );
};
