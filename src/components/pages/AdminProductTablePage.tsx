import {
  fetchProductsAction,
  updateProductStatusAction,
} from "@/redux/modules/product";
import { RootState } from "@/redux/store";
import {
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
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
  Tag,
  theme,
} from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { ProductModalCreate } from "../organisms/ProductModalCreate";
import { ProductModalEdit } from "../organisms/ProductModalEdit";
import { AdminLayout } from "../templates/AdminLayout";
const { useToken } = theme;

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
        Tải xuống
      </Button>
      <Button
        type="default"
        icon={<ImportOutlined />}
        style={{ marginRight: "10px" }}
      >
        Nhập
      </Button>

      <ProductModalCreate />
    </Col>
  </Flex>
);

export const AdminProductTablePage = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.product
  );
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      fetchProductsAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  const handleViewDetails = (productId: string) => {
    navigate(`/admin/product-details/${productId}`);
  };

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading}
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
              : ["createdAt,desc"]; // Default sort by createdAt desc

          dispatch(
            fetchProductsAction({
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
          name: (
            <Link to={`/admin/product-details/${it.id}`}>
              <AvatarInfo
                fullName={it.name}
                avatar={it.thumbnail}
                info={`/${it.slug}`}
              />
            </Link>
          ),
          categories: [""].join(", "),
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          status: (
            <Tag
              icon={it.status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              color={it.status ? "success" : "error"}
            >
              {it.status ? "Hiển thị" : "Ẩn"}
            </Tag>
          ),
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
                      label: <ProductModalEdit product={it} />,
                    };
                  }
                  if (item.key === "3") {
                    return {
                      ...item,
                      onClick: () => handleViewDetails(it.id),
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
                      title="Sure to delete?"
                      onConfirm={() =>
                        dispatch(
                          updateProductStatusAction({
                            pid: it.id,
                            status: !it.status,
                          })
                        )
                      }
                    >
                      <Button
                        className="w-full justify-start"
                        type={it.status ? "primary" : "default"}
                        icon={
                          it.status ? <EyeInvisibleOutlined /> : <EyeOutlined />
                        }
                        loading={isUpdateLoading}
                      >
                        {it.status ? <>Ẩn</> : <>Hiển thị</>}
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
    label: "Chỉnh sửa",
  },
  {
    key: "2",
    icon: <CopyOutlined />,
    label: "Copy ID",
  },
  {
    key: "3",
    icon: <EyeOutlined />,
    label: "Xem món ăn chi tiết",
  },
];

const getColumns = () => {
  return [
    {
      title: "STT",
      dataIndex: "no",
    },
    {
      title: "Tên món ăn",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Danh mục món ăn",
      dataIndex: "categories",
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Hiển thị",
          value: true,
        },
        {
          text: "Ẩn",
          value: false,
        },
      ],
      filterMultiple: false,
    },
    {
      title: "Hành động",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
