import {
  confirmationPosPaidAction,
  fetchPostPaidByRetailerAction,
} from "@/redux/modules/postpaid";
import { RootState } from "@/redux/store";
import { currencyFormat, getThumbnail } from "@/utils/common";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Col,
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
import { Link } from "react-router-dom";

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
        <Popconfirm title="Bạn chắc chắn muốn xóa những mục này?">
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

export const AdminPostPaidTablePage = () => {
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [status, setStatus] = useState("PAYING");
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.postpaid
  );

  useEffect(() => {
    dispatch(
      fetchPostPaidByRetailerAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["created_at,desc"],
          paymentStatus: status,
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
                      status === "PAYING" && !isFetchLoading
                        ? page.totalElements
                        : 0
                    }
                    overflowCount={999}
                  >
                    Chưa thanh toán
                  </Badge>
                ),
                value: "PAYING",
              },
              {
                label: (
                  <Badge
                    className="px-1 "
                    count={
                      status === "PAID" && !isFetchLoading
                        ? page.totalElements
                        : 0
                    }
                    overflowCount={999}
                  >
                    Đã thanh toán
                  </Badge>
                ),
                value: "PAID",
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
        scroll={{ x: "max-content" }}
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
            fetchPostPaidByRetailerAction({
              queryParams: {
                page: pagination.current ? pagination.current - 1 : 0,
                pageSize: pagination.pageSize,
                sort,
                paymentStatus: status,
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
          id: (
            <Tooltip title="Xem chi tiết phiếu nợ">
              <Link to={`/admin/orders-postpaid-detail/${it.id}`}>
                PN-{it.id.toUpperCase().substring(0, 7)}
              </Link>
            </Tooltip>
          ),
          fullName: (
            <AvatarInfo
              fullName={it.user?.address.fullName}
              avatar={getThumbnail(it.user?.avatar)}
              info={`${it.user?.username}`}
            />
          ),
          totalAmount: (
            <div className="font-medium">
              <div>Tổng tiền: {currencyFormat(it.totalAmount)}</div>
            </div>
          ),
          createdAt:
            it.createdAt &&
            format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          updatedAt:
            it.updatedAt &&
            it.payment.status === "PAID" &&
            format(new Date(it.updatedAt), "HH:mm:ss - dd/MM/yyyy"),
          paymentStatus:
            it.payment.status === "PAYING" || it.payment.status === "FAILED" ? (
              <div className="text-center italic">
                {it.totalAmount > 0 && (
                  <Tooltip title="Nhấn vào nút để xác nhận thanh toán cho phiếu nợ này.">
                    <Popconfirm
                      title="Bạn chắc chắn xác nhận thanh toán cho phiếu nợ này?"
                      onConfirm={() =>
                        dispatch(
                          confirmationPosPaidAction({
                            pid: it.id,
                          })
                        )
                      }
                    >
                      <Button
                        danger
                        size="small"
                        type="success"
                        icon={<CheckCircleOutlined />}
                        loading={it.isUpdateStatusLoading}
                      >
                        Xác nhận thanh toán bằng tiền mặt
                      </Button>
                    </Popconfirm>
                  </Tooltip>
                )}
              </div>
            ) : (
              <div className="text-center italic">
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Đã thanh toán
                </Tag>
              </div>
            ),
        }))}
        size="small"
        locale={{
          triggerDesc: "Nhấn vào để sắp xếp từ Z-A",
          triggerAsc: "Nhấn vào để sắp xếp từ A-Z",
          cancelSort: "Nhấn vào để hủy sắp xếp",
        }}
      />
    </AdminLayout>
  );
};

const getColumns = () => {
  return [
    {
      title: "STT",
      dataIndex: "no",
    },
    {
      title: "Mã phiếu nợ",
      dataIndex: "id",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
    },
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      showSorterTooltip: { target: "full-header" },
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
      title: "Ngày trả",
      dataIndex: "updatedAt",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
  ] as TableColumnsType;
};
