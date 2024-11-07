import EmptyNotice from "@/components/atoms/EmptyNotice";
import { fetchOrdersByCustomerAction } from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { Order } from "@/type/types";
import { Badge, List, Segmented, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderCard from "../molecules/OrderCard";
import { ManagementLayout } from "../templates/ManagementLayout";
import { LoadingPage } from "./LoadingPage";

const ORDER_STATUSES = [
  { label: "Chờ xác nhận", value: "PENDING" },
  { label: "Bị từ chối", value: "REJECTED" },
  { label: "Đang chế biến", value: "APPROVED" },
  { label: "Đang giao", value: "DELIVERING" },
  { label: "Đã nhận hàng", value: "COMPLETED" },
  { label: "Đã hủy", value: "CANCELLED" },
];

export const OrderPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("PENDING");

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchOrdersByCustomerAction({
        queryParams: {
          page: 0,
          sort: ["createdAt,desc"],
          pageSize: 10,
          orderStatus: status,
          orderGroup: false,
        },
      })
    );
  }, [dispatch, status]);

  if (page.content.length < 0 || isFetchLoading) {
    return <LoadingPage />;
  }

  return (
    <ManagementLayout>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <Segmented
          value={status}
          onChange={(value) => {
            if (!isFetchLoading) {
              setStatus(value);
              setCurrentPage(1);
            }
          }}
          disabled={isFetchLoading}
          options={ORDER_STATUSES.map((it) => ({
            label: (
              <Badge
                className="px-1"
                count={
                  it.value === "PENDING" &&
                  it.value === status &&
                  !isFetchLoading
                    ? page.totalElements
                    : 0
                }
                overflowCount={999}
              >
                {it.label}
              </Badge>
            ),
            value: it.value,
          }))}
        />
      </Space>
      <List
        grid={{
          gutter: 16,
          column: 2,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        dataSource={page.content}
        renderItem={(order: Order, index: number) => (
          <List.Item>
            <OrderCard
              order={order}
              index={(currentPage - 1) * 10 + index + 1}
              isFetchLoading={isFetchLoading}
              orderGroup={false}
            />
          </List.Item>
        )}
        locale={{
          emptyText: (
            <EmptyNotice
              w="72"
              h="60"
              src="/no-order.png"
              message="Chưa có đơn hàng"
            />
          ),
        }}
        pagination={
          page.content.length === 0
            ? false
            : {
                total: page.totalElements,
                pageSize: 10,
                current: currentPage,
                onChange: (page: number) => {
                  setCurrentPage(page);
                  dispatch(
                    fetchOrdersByCustomerAction({
                      queryParams: {
                        page: page - 1,
                        sort: ["createdAt,desc"],
                        pageSize: 10,
                        orderStatus: status,
                        orderGroup: false,
                      },
                    })
                  );
                },
                showSizeChanger: false,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} đơn hàng`,
                style: { display: "flex", justifyContent: "center" },
              }
        }
      />
    </ManagementLayout>
  );
};
