import { SalesLabel } from "@/components/atoms/SalesLabel.tsx";
import {
  fetchRefundByRetailerAction,
  refundConfirmationAction,
  updateOrderStatusAction,
} from "@/redux/modules/order";
import { RootState } from "@/redux/store";
import { currencyFormat } from "@/utils/common";
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
  TransactionOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Col,
  Dropdown,
  Flex,
  Popconfirm,
  Segmented,
  Space,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
} from "antd";
import Button from "antd-button-color";
import "antd-button-color/dist/css/style.css";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AdminLayout } from "../templates/AdminLayout";
import "./AdminOrderTablePage.scss";

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

export const AdminRefundTablePage = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [status, setStatus] = useState("REFUNDING");
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchRefundByRetailerAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["created_at,desc"],
          orderStatus: status,
        },
      })
    );
  }, [dispatch, status]);

  return (
    <AdminLayout>
      <div className="flex justify-between">
        <Space direction="vertical" style={{ marginBottom: 16 }} className="">
          <Segmented
            className=""
            value={status}
            onChange={(value) => {
              if (!isFetchLoading) {
                setStatus(value.toString());
              }
            }}
            disabled={isFetchLoading}
            options={[
              {
                label: (
                  <Badge
                    className="px-1 "
                    count={
                      status === "REFUNDING" && !isFetchLoading
                        ? page.totalElements
                        : 0
                    }
                    overflowCount={999}
                  >
                    Chưa hoàn tiền
                  </Badge>
                ),
                value: "REFUNDING",
              },
              {
                label: (
                  <Badge
                    className="px-1 "
                    count={
                      status === "REFUNDED" && !isFetchLoading
                        ? page.totalElements
                        : 0
                    }
                    overflowCount={999}
                  >
                    Đã hoàn tiền
                  </Badge>
                ),
                value: "REFUNDED",
              },
            ]}
          />
        </Space>
        <TableToolbar
          isFetchLoading={isFetchLoading}
          selectedRowKeys={selectedRowKeys}
        />
      </div>
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
            fetchRefundByRetailerAction({
              queryParams: {
                page: pagination.current ? pagination.current - 1 : 0,
                pageSize: pagination.pageSize,
                sort,
                orderStatus: status,
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
              avatar={it.user && it.user.avatar}
              info={`${it.user ? it.user.username : ""}`}
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
          ferund: (
            <>
              {["CANCELLED", "COMPLETED", "REJECTED", "FAILED"].includes(
                it.status
              ) && (
                <>
                  {!(
                    it.status === "FAILED" && it.payment.status === "REFUNDING"
                  ) && (
                    <div className="text-center italic">
                      <Tag
                        color={
                          it.status === "COMPLETED" ||
                          it.payment?.status === "REFUNDED"
                            ? "success"
                            : "error"
                        }
                        icon={
                          it.status === "COMPLETED" ? (
                            <CheckCircleOutlined />
                          ) : it.payment?.status === "REFUNDED" ? (
                            <TransactionOutlined />
                          ) : (
                            <CloseCircleOutlined />
                          )
                        }
                      >
                        {it.status === "COMPLETED" ? (
                          "Đã hoàn thành"
                        ) : it.status === "CANCELLED" ? (
                          "Khách huỷ"
                        ) : it.status === "REJECTED" ? (
                          <Tooltip title="Phía cửa hàng đã từ chối tiếp nhận đơn hàng.">
                            Đã từ chối
                          </Tooltip>
                        ) : (
                          it.payment?.status === "REFUNDED" && (
                            <Tooltip title="Vì lý do không mong muốn nên đơn hàng đã bị hủy.">
                              Đã hoàn tiền
                            </Tooltip>
                          )
                        )}
                      </Tag>
                    </div>
                  )}
                </>
              )}
              <Tooltip title="Nhấn vào nút trạng thái để có thể cập nhật lại trạng thái đơn hàng.">
                <div className="flex justify-center gap-2">
                  {it.payment?.status === "REFUNDING" && (
                    <Popconfirm
                      title="Bạn chắc chắn xác nhận hoàn tiền cho đơn hàng này?"
                      onConfirm={() =>
                        dispatch(
                          refundConfirmationAction({
                            oid: it.id,
                          })
                        )
                      }
                    >
                      <Button
                        type="primary"
                        size="small"
                        icon={<CheckCircleOutlined />}
                        loading={it.isUpdateStatusLoading}
                      >
                        Xác nhận hoàn tiền
                      </Button>
                    </Popconfirm>
                  )}

                  {!["REFUNDING", "REFUNDED"].includes(it.payment?.status) && (
                    <>
                      {it.status === "PENDING" && (
                        <>
                          <Popconfirm
                            title="Bạn chắc chắn xác nhận đơn hàng này?"
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
                            title="Bạn chắc chắn từ chối đơn hàng này?"
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
                                Đã giao
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
      dataIndex: "ferund",
    },
    {
      title: "__________Khách hàng",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
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
