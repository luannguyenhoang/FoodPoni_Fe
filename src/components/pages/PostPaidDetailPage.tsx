import EmptyNotice from "@/components/atoms/EmptyNotice";
import { fetchPostPaidOrdersAction } from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { ORDER_STATUSES } from "@/utils/common";
import { Badge, List, Segmented, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ProductLoading } from "../atoms/ProductLoading";
import OrderCard from "../molecules/OrderCard";
import { ManagementLayout } from "../templates/ManagementLayout";

export const PostPaidDetailPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("APPROVED");
  const [orderGroup, setOrderGroup] = useState(false);
  const location = useLocation();
  const ppid = location.pathname.split("/").pop();

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    if (ppid) {
      dispatch(
        fetchPostPaidOrdersAction({
          ppid,
          queryParams: {
            page: 0,
            sort: ["createdAt,desc"],
            pageSize: 10,
            status,
            orderGroup: orderGroup,
          },
        })
      );
    }
  }, [dispatch, status, ppid, orderGroup]);

  // if (page.content.length < 0 || isFetchLoading) {
  //   return (
  //     <ManagementLayout>
  //       <ProductLoading />
  //     </ManagementLayout>
  //   );
  // }
  return (
    <ManagementLayout>
      <Space direction="vertical" style={{ marginBottom: 16 }}>
        <div className="flex justify-between">
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
                    it.key === "APPROVED" &&
                    it.key === status &&
                    !isFetchLoading
                      ? page.totalElements
                      : 0
                  }
                  overflowCount={999}
                >
                  {it.label}
                </Badge>
              ),
              value: it.key,
            }))}
          />
          <Segmented
            className="bg-primary text-white"
            value={orderGroup}
            onChange={(value) => {
              if (!isFetchLoading) {
                setOrderGroup(value);
                setCurrentPage(1);
              }
            }}
            disabled={isFetchLoading}
            options={[
              { label: "Đơn hàng thường", value: false },
              { label: "Đơn hàng nhóm", value: true },
            ]}
          />
        </div>
      </Space>
      {!isFetchLoading ? (
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
          renderItem={(order, index) => (
            <List.Item>
              <OrderCard
                order={order}
                index={(currentPage - 1) * 10 + index + 1}
                orderGroup={orderGroup}
              />
            </List.Item>
          )}
          locale={{
            emptyText: (
              <EmptyNotice
                h="40"
                w="48"
                src="/emty-1.png"
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
                    if (ppid) {
                      setCurrentPage(page);
                      dispatch(
                        fetchPostPaidOrdersAction({
                          ppid,
                          queryParams: {
                            page: page - 1,
                            sort: ["createdAt,desc"],
                            pageSize: 10,
                            status,
                            orderGroup: orderGroup,
                          },
                        })
                      );
                    }
                  },
                  showSizeChanger: false,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} đơn hàng`,
                  style: { display: "flex", justifyContent: "center" },
                }
          }
        />
      ) : (
        <ProductLoading />
      )}
    </ManagementLayout>
  );
};
