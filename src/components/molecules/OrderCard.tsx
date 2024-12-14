import { refundAction } from "@/redux/modules/order";
import { Order } from "@/type/types";
import { currencyFormat } from "@/utils/common.ts";
import {
  EnvironmentOutlined,
  TransactionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Popconfirm } from "antd";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const statusText: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  APPROVED: "Đang chế biến",
  DELIVERING: "Đang giao",
  CANCELLED: "Đã hủy",
  REJECTED: "Bị từ chối",
  COMPLETED: "Hoàn thành",
  POST_PAID: "Ghi nợ",
  FAILED: "Gặp sự cố",
};

const statusColors: Record<string, string> = {
  PENDING: "orange",
  APPROVED: "blue",
  DELIVERING: "orange",
  CANCELLED: "red",
  REJECTED: "red",
  COMPLETED: "green",
  POST_PAID: "gray",
  FAILED: "red",
};

const OrderCard = ({
  order,
  index,
  orderGroup,
}: {
  order: Order & { isUpdatePaymentStatusLoading?: boolean };
  index: number;
  orderGroup: boolean;
}) => {
  const dispatch = useDispatch();

  return (
    <div>
      <Link
        to={
          order.payment.method === "POSTPAID"
            ? `/ghi-no/don-hang/${order.id}`
            : orderGroup
              ? `/don-hang-nhom/${order.id}`
              : `/don-hang/${order.id}`
        }
      >
        <Badge.Ribbon
          text={statusText[order.status]}
          color={statusColors[order.status]}
        >
          <Card
            className="font-sans min-h-60 !border-orange-200"
            hoverable={true}
            title={
              <div className="flex gap-2 items-center">
                <span>{`${index}. Đơn hàng #${order.id?.substring(0, 7).toUpperCase()} `}</span>
                <span className="text-primary font-bold">/</span>
                <span>
                  {order.createdAt &&
                    format(new Date(order.createdAt), "HH:mm:ss - dd/MM/yyyy")}
                </span>
              </div>
            }
          >
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Thông tin đơn hàng:
            </h2>
            <ul className="max-w-md space-y-1 text-gray-500 list-inside">
              <li>
                <UserOutlined /> Khách hàng: {order.shippingAddress.fullName}
              </li>
              <li>
                <EnvironmentOutlined /> Địa chỉ: {order.shippingAddress.address}
              </li>
            </ul>
            <div className="flex justify-between">
              <div className="flex justify-between">
                <div className="flex justify-end mt-4 text-xl gap-2 font-sans">
                  <div className="text-gray-400">Tổng tiền:</div>
                  <div className="nunito text-green-600">
                    {currencyFormat(order.totalAmount + order.shippingFee)}
                  </div>
                </div>
              </div>
              <div
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                {order.status === "FAILED" &&
                  order.payment.method === "VNPAY" &&
                  order.payment.status !== "PAYING" && (
                    <Popconfirm
                      title="Bạn có chắc chắn muốn hoàn tiền?"
                      onConfirm={() => {
                        dispatch(refundAction({ oid: order.id }));
                      }}
                    >
                      <Button
                        className="mt-4 bg-primary text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        disabled={
                          order.payment.status === "REFUNDING" ||
                          order.payment.status === "REFUNDED"
                        }
                        loading={order.isUpdatePaymentStatusLoading}
                        icon={<TransactionOutlined />}
                      >
                        {order.payment.status === "REFUNDING"
                          ? "Đang hoàn tiền"
                          : order.payment.status === "REFUNDED"
                            ? "Đã hoàn tiền"
                            : "Hoàn tiền"}
                      </Button>
                    </Popconfirm>
                  )}
              </div>
            </div>
          </Card>
        </Badge.Ribbon>
      </Link>
    </div>
  );
};

export default OrderCard;
