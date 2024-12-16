import EmptyNotice from "@/components/atoms/EmptyNotice";
import {
  fetchOrdersByCustomerAction,
  searchOrdersByCustomerAction,
} from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { ORDER_STATUSES } from "@/utils/common";
import { Badge, Input, List, Segmented } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ProductLoading } from "../atoms/ProductLoading";
import OrderCard from "../molecules/OrderCard";
import { ManagementLayout } from "../templates/ManagementLayout";

export const OrderPage = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("PENDING");

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  const [keyword, setKeyword] = useState<string>("");

  useEffect(() => {
    dispatch(
      fetchOrdersByCustomerAction({
        queryParams: {
          page: 0,
          sort: ["createdAt,desc"],
          pageSize: 10,
          status,
          orderGroup: false,
        },
      })
    );
  }, [dispatch, status]);

  // if (isFetchLoading) {
  //   return (
  //     <ManagementLayout>
  //       <ProductLoading />
  //     </ManagementLayout>
  //   );
  // }

  return (
    <ManagementLayout>
      <Input
        className="max-w-lg mb-4"
        placeholder="Tìm kiếm..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          dispatch(
            searchOrdersByCustomerAction({
              keyword: e.target.value,
              type: "ORDER",
            })
          );
          setKeyword(e.target.value);
        }}
      />
      {!keyword && (
        <div className="overflow-scroll scrollbar-rounded mb-4">
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
                    it.key === "PENDING" && it.key === status && !isFetchLoading
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
        </div>
      )}
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
                orderGroup={false}
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
                    setCurrentPage(page);
                    dispatch(
                      fetchOrdersByCustomerAction({
                        queryParams: {
                          page: page - 1,
                          sort: ["createdAt,desc"],
                          pageSize: 10,
                          status,
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
      ) : (
        <ProductLoading />
      )}
    </ManagementLayout>
  );
};
