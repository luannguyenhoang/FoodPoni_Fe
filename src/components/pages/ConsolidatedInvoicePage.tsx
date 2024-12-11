import {
  createPostPaidOrdersAction,
  fetchConsolidatedInvoiceAction,
} from "@/redux/modules/invoice";
import { RootState } from "@/redux/store";
import { currencyFormat, POSTPAID_STATUSES } from "@/utils/common";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  MoneyCollectOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Popconfirm,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { format } from "date-fns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ManagementLayout } from "../templates/ManagementLayout";
import "./AdminOrderTablePage.scss";

const TableToolbar = () => (
  <Flex className="mb-4" justify="space-between">
    <Col></Col>
    <Col>
      <Button
        type="default"
        icon={<DownloadOutlined />}
        style={{ marginRight: "10px" }}
      >
        Tải xuống
      </Button>
    </Col>
  </Flex>
);

export const ConsolidatedInvoicePage = () => {
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.invoice
  );

  useEffect(() => {
    dispatch(
      fetchConsolidatedInvoiceAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  return (
    <ManagementLayout>
      <TableToolbar />
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
            fetchConsolidatedInvoiceAction({
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
          showTotal: (total) => `Tổng ${total} mục`,
          size: "default",
        }}
        loading={isFetchLoading}
        columns={getColumns()}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: page.number * page.size + index + 1,
          code: (
            <Link to={`/ghi-no/${it.id}`}>
              {it.id.toUpperCase().substring(0, 6)}
            </Link>
          ),
          totalAmount: (
            <div className="font-medium">
              <div>{currencyFormat(it.totalAmount)}</div>
            </div>
          ),
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          status: (
            <div className="text-center italic">

            <Tag
              icon={
                it.payment.status === "PAID" ? (
                  <CheckCircleOutlined />
                ) : it.payment.status === "FAILED" ? (
                  <CloseCircleOutlined />
                ) : (
                  <ExclamationCircleOutlined />
                )
              }
              color={
                it.payment.status === "PAID"
                  ? "success"
                  : it.payment.status === "FAILED"
                    ? "error"
                    : "warning"
              }
            >
              {it.payment.status === "PAID"
                ? "Đã thanh toán"
                : it.payment.status === "FAILED"
                  ? "Thanh toán thất bại"
                  : "Chưa thanh toán"}
            </Tag>
            </div>
          ),
          actions: (
            <div className="text-center italic">

            <Popconfirm
              title="Bạn có chắc chắn muốn thanh toán phiếu nợ này?"
              onConfirm={() => {
                dispatch(
                  createPostPaidOrdersAction({
                    ppid: it.id,
                  })
                );
              }}
              okText="Đồng ý"
              cancelText="Hủy"
            >
              <Button
                className="bg-primary text-white m-auto"
                icon={
                  it.payment.status === "PAID" ? (
                    <CheckCircleOutlined />
                  ) : it.payment.status === "FAILED" ? (
                    <SyncOutlined />
                  ) : (
                    <MoneyCollectOutlined />
                  )
                }
                loading={it.isPaymentLoading}
                disabled={it.payment.status === "PAID"}
              >
                {it.payment.status === "PAID"
                  ? "Đã thanh toán"
                  : it.payment.status === "FAILED"
                    ? "Thanh toán lại bằng VNPAY"
                    : "Thanh toán bằng VNPAY"}
              </Button>
            </Popconfirm>
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
    </ManagementLayout>
  );
};

const getColumns = () => {
  return [
    {
      title: "STT",
      dataIndex: "no",
    },
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: POSTPAID_STATUSES.map((it) => ({
        text: it.label,
        value: it.key,
      })),
      filterMultiple: true,
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
      title: "Hành động",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
