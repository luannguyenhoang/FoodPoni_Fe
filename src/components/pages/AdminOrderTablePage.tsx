import "antd-button-color/dist/css/style.css";
import {
  fetchOrdersByRetailerAction,
  updateOrderStatusAction,
} from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { currencyFormat, getThumbnail, ORDER_STATUSES } from "@/utils/common";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DownloadOutlined,
  FrownOutlined,
  LineOutlined,
  SendOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Col,
  Dropdown,
  Flex,
  Popconfirm,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AdminLayout } from "../templates/AdminLayout";
import "./AdminOrderTablePage.scss";
import { SalesLabel } from "@/components/atoms/SalesLabel.tsx";
import Button from "antd-button-color";

const TableToolbar = ({
  isFetchLoading,
  selectedRowKeys,
}: {
  isFetchLoading: boolean;
  selectedRowKeys: Array<React.Key>;
}) => (
  <Flex className="mb-4" justify="space-between">
    <Col>
      {selectedRowKeys.length > 0 && (
        <Popconfirm title="Are you sure you want to delete these items?">
          <Button
            className="bg-red-500 text-white"
            type="default"
            icon={<CloseCircleOutlined />}
            style={{ marginRight: "10px" }}
            disabled={isFetchLoading}
          >
            Delete All
            <Badge
              className="absolute -top-3 -right-2"
              count={selectedRowKeys.length}
            />
          </Button>
        </Popconfirm>
      )}
    </Col>
    <Col>
      <Button
        type="default"
        icon={<DownloadOutlined />}
        style={{ marginRight: "10px" }}
      >
        Download
      </Button>
    </Col>
  </Flex>
);

export const AdminOrderTablePage = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchOrdersByRetailerAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading}
        selectedRowKeys={selectedRowKeys}
      />
      <Table
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0 // Kiểm tra nếu sorter không phải là đối tượng rỗng
              ? (Array.isArray(sorter) // Kiểm tra nếu sorter là một mảng
                  ? sorter // Nếu là mảng, giữ nguyên
                  : [sorter]
                ).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`
                )
              : []; // Nếu là đối tượng, biến thành mảng rỗng

          dispatch(
            fetchOrdersByRetailerAction({
              queryParams: {
                page: pagination.current ? pagination.current - 1 : 0,
                pageSize: pagination.pageSize,
                sort,
                status:
                  filters && filters["status"]
                    ? (filters["status"][0] as boolean)
                    : undefined,
              },
            })
          );
        }}
        pagination={{
          total: page.totalElements,
          pageSize: page.size,
          current: page.number + 1,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Total ${total} items`,
          size: "default",
        }}
        loading={isFetchLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={getColumns()}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: page.number * page.size + index + 1,
          code: it.id.toUpperCase().substring(0, 6),
          name: (
            <AvatarInfo
              fullName={it.shippingAddress.fullName}
              avatar={getThumbnail(it.user.avatar)}
              info={`${it.user.username}`}
            />
          ),
          totalAmount: (
            <div className="font-medium">
              <div>{currencyFormat(it.totalAmount + it.shippingFee)}</div>
              <div className="text-xs text-gray-500">
                Tổng tiền: {currencyFormat(it.totalAmount)}
              </div>
              <div className="text-xs text-gray-500">
                Phí giao hàng: {currencyFormat(it.shippingFee)}
              </div>
            </div>
          ),
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          status: (
            <>
              {["CANCELLED", "COMPLETED", "REJECTED", "FAILED"].includes(
                it.status
              ) && (
                <div className="text-center italic">
                  <Tag
                    color={it.status === "COMPLETED" ? "success" : "error"}
                    icon={
                      it.status === "COMPLETED" ? (
                        <CheckCircleOutlined />
                      ) : (
                        <CloseCircleOutlined />
                      )
                    }
                  >
                    {it.status === "COMPLETED" ? (
                      "Đã hoàn thành"
                    ) : it.status === "CANCELLED" ? (
                      "Khách huỷ"
                    ) : it.status === "REJECTED" ? (
                      <Tooltip title="Phía cửa hàng đã từ chối tiếp nhận đơn hàng.">
                        Đã từ chối
                      </Tooltip>
                    ) : (
                      it.status === "FAILED" && (
                        <Tooltip title="Vì lý do không mong muốn nên đơn hàng đã bị hủy.">
                          Gặp sự cố
                        </Tooltip>
                      )
                    )}
                  </Tag>
                </div>
              )}
              <Tooltip title="Nhấn vào nút trạng thái để có thể cập nhật lại trạng thái đơn hàng.">
                <div className="flex justify-center gap-2">
                  {it.status === "PENDING" && (
                    <>
                      <Popconfirm
                        title="Bạn chắc chắn xác nhận đơn hàng này?"
                        onConfirm={() =>
                          dispatch(
                            updateOrderStatusAction({
                              oid: it.id,
                              orderStatus: "APPROVED",
                            })
                          )
                        }
                      >
                        <Button
                          type="info"
                          size="small"
                          icon={<SyncOutlined spin />}
                          loading={it.isUpdateStatusLoading}
                        >
                          Xác nhận
                        </Button>
                      </Popconfirm>
                      <Popconfirm
                        title="Bạn chắc chắn từ chối đơn hàng này?"
                        onConfirm={() =>
                          dispatch(
                            updateOrderStatusAction({
                              oid: it.id,
                              orderStatus: "REJECTED",
                            })
                          )
                        }
                      >
                        <Button
                          type="primary"
                          danger
                          size="small"
                          icon={<CloseCircleOutlined />}
                          loading={it.isUpdateStatusLoading}
                        >
                          Từ chối
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                  {["APPROVED", "DELIVERING"].includes(it.status) && (
                    <>
                      {it.status === "APPROVED" && (
                        <Popconfirm
                          title="Bạn chắc chắn sẽ giao đơn hàng này?"
                          onConfirm={() =>
                            dispatch(
                              updateOrderStatusAction({
                                oid: it.id,
                                orderStatus: "DELIVERING",
                              })
                            )
                          }
                        >
                          <Button
                            type="warning"
                            size="small"
                            icon={<SendOutlined />}
                            loading={it.isUpdateStatusLoading}
                          >
                            Gửi giao hàng
                          </Button>
                        </Popconfirm>
                      )}
                      {it.status === "DELIVERING" && (
                        <Popconfirm
                          title="Bạn chắc chắn đơn hàng này đã được giao thành công?"
                          onConfirm={() =>
                            dispatch(
                              updateOrderStatusAction({
                                oid: it.id,
                                orderStatus: "COMPLETED",
                              })
                            )
                          }
                        >
                          <Button
                            type="success"
                            size="small"
                            icon={<CheckCircleOutlined />}
                            loading={it.isUpdateStatusLoading}
                          >
                            Xác nhận đã giao
                          </Button>
                        </Popconfirm>
                      )}
                      <Popconfirm
                        title="Bạn chắc chắn sẽ hủy đơn hàng này?"
                        onConfirm={() =>
                          dispatch(
                            updateOrderStatusAction({
                              oid: it.id,
                              orderStatus: "FAILED",
                            })
                          )
                        }
                      >
                        <Button
                          size="small"
                          danger
                          icon={<FrownOutlined />}
                          loading={it.isUpdateStatusLoading}
                        >
                          Gặp sự cố
                        </Button>
                      </Popconfirm>
                    </>
                  )}
                </div>
              </Tooltip>
            </>
          ),
          actions: (
            <div className="overflow-hidden">
              {it.postPaidOrderId && <SalesLabel content="Nợ" />}
              <Dropdown
                trigger={["click"]}
                placement="bottomLeft"
                arrow={{ pointAtCenter: true }}
                menu={{
                  items: tableRowActions,
                }}
              >
                <div className="text-center">
                  <DashOutlined />
                </div>
              </Dropdown>
            </div>
          ),
        }))}
        size="small"
      />
    </AdminLayout>
  );
};

const tableRowActions = [
  {
    key: "1",
    icon: <CopyOutlined />,
    label: "Copy ID",
  },
  {
    key: "2",
    icon: <LineOutlined />,
    label: "Copy Data Row",
  },
];

const getColumns = () => {
  return [
    {
      title: "No.",
      dataIndex: "no",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: ORDER_STATUSES.map((it) => ({
        text: it.label,
        value: it.key,
      })),
      filterMultiple: true,
    },
    {
      title: "__________Khách hàng",
      dataIndex: "name",
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
