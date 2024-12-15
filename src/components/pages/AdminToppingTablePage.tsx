import {
  deleteToppingAction,
  fetchToppingsAction,
} from "@/redux/modules/topping";
import { RootState } from "@/redux/store";
import { formatCurrency } from "@/utils/common";
import {
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ImportOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Flex,
  Popconfirm,
  Table,
  TableColumnsType,
  theme,
} from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToppingModalCreate } from "../organisms/ToppingModalCreate";
import { ToppingModalEdit } from "../organisms/ToppingModalEdit";
import { AdminLayout } from "../templates/AdminLayout";

const { useToken } = theme;

const TableToolbar = ({
  isFetchLoading,
  selectedRowKeys,
}: {
  isFetchLoading: boolean;
  isUpdateLoading: boolean;
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
        Tải xuống
      </Button>
      <Button
        type="default"
        icon={<ImportOutlined />}
        style={{ marginRight: "10px" }}
      >
        Nhập
      </Button>

      <ToppingModalCreate />
    </Col>
  </Flex>
);

export const AdminToppingTablePage = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.topping
  );

  useEffect(() => {
    dispatch(
      fetchToppingsAction({
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
        isUpdateLoading={isUpdateLoading}
        selectedRowKeys={selectedRowKeys}
      />
      <Table
        scroll={{ x: "max-content" }}
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0
              ? (Array.isArray(sorter) ? sorter : [sorter]).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`
                )
              : ["createdAt,desc"];

          dispatch(
            fetchToppingsAction({
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
          name: it.name,
          price: formatCurrency(it.price),
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          updatedAt:
            it.updatedAt &&
            format(new Date(it.updatedAt), "HH:mm:ss - dd/MM/yyyy"),
          actions: (
            <Dropdown
              trigger={["click"]}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
              menu={{
                items: tableRowActions.map((item) => {
                  if (item.key === "1") {
                    return {
                      ...item,
                      label: <ToppingModalEdit topping={it} />,
                    };
                  }
                  return item;
                }),
              }}
              dropdownRender={(menu) => (
                <div
                  style={{
                    backgroundColor: token.colorBgElevated,
                    borderRadius: token.borderRadiusLG,
                    boxShadow: token.boxShadowSecondary,
                  }}
                >
                  {React.cloneElement(menu as React.ReactElement, {
                    style: {
                      boxShadow: "none",
                    },
                  })}
                  <Divider style={{ margin: 0 }} />
                  <div style={{ padding: 8 }}>
                    <Popconfirm
                      title="Bạn có muốn xóa?"
                      onConfirm={() =>
                        dispatch(deleteToppingAction({ tid: it.id }))
                      }
                    >
                      <Button
                        className="w-full justify-start"
                        type="primary"
                        loading={isUpdateLoading}
                        icon={<DeleteOutlined />}
                      >
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              )}
            >
              <div className="text-center">
                <DashOutlined />
              </div>
            </Dropdown>
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

const tableRowActions = [
  {
    key: "1",
    icon: <EditOutlined />,
    label: "Sửa",
  },
  {
    key: "2",
    icon: <CopyOutlined />,
    label: "Copy ID",
  },
];

const getColumns = () => {
  return [
    {
      title: "STT",
      dataIndex: "no",
    },
    {
      title: "Tên toppping",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },

    {
      title: "Giá",
      dataIndex: "price",
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
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Hành động",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
