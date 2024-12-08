import {
  fetchProductsAction,
  updateProductStatusAction,
} from "@/redux/modules/product";
import { RootState } from "@/redux/store";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  ImportOutlined,
  RollbackOutlined,
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
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
        Download
      </Button>
      <Button
        type="default"
        icon={<ImportOutlined />}
        style={{ marginRight: "10px" }}
      >
        Import
      </Button>

      <ProductModalCreate />
    </Col>
  </Flex>
);

export const ProductTablePage = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.product
  );

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
          name: (
            <AvatarInfo
              fullName={it.name}
              avatar={it.thumbnail}
              info={`/${it.slug}`}
            />
          ),
          categories: [""].join(", "),
          createdAt: it.createdAt.toLocaleString(),
          status: (
            <Tag
              icon={
                it.status ? <CheckCircleOutlined /> : <CloseCircleOutlined />
              }
              color={it.status ? "success" : "error"}
            >
              {it.status ? "Active" : "Inactive"}
            </Tag>
          ),
          actions: (
            <Dropdown
              trigger={["click"]}
              placement="bottomLeft"
              arrow={{ pointAtCenter: true }}
              menu={{
                items: tableRowActions.map((item) => {
                  if (item.key === "1") {
                    return {
                      ...item,
                      label: <ProductModalEdit product={it} />,
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
                          it.status ? <DeleteOutlined /> : <RollbackOutlined />
                        }
                        loading={isUpdateLoading}
                      >
                        {it.status ? <>Delete</> : <>Restore</>}
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
      />
    </AdminLayout>
  );
};

const tableRowActions = [
  {
    key: "1",
    icon: <EditOutlined />,
    label: "Edit",
  },
  {
    key: "2",
    icon: <CopyOutlined />,
    label: "Copy ID",
  },
  {
    key: "3",
    icon: <EyeOutlined />,
    label: "Preview Card",
  },
];

const getColumns = () => {
  return [
    {
      title: "No.",
      dataIndex: "no",
    },
    {
      title: "__________Name",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Categories",
      dataIndex: "categories",
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
    },
    {
      title: "Created Date",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 1,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
      filterMultiple: false,
    },
    {
      title: "Actions",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
