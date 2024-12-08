import {
  deleteProductCategoryAction,
  fetchProductCategoriesAction,
} from "@/redux/modules/productCategory";
import { RootState } from "@/redux/store";
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
import { AvatarInfo } from "../atoms/AvatarInfo";
import { ProductCategoriesModalCreate } from "../organisms/ProductCategoriesModalCreate";
import { ProductCategoriesModalEdit } from "../organisms/ProductCategoriesModalEdit";
import { AdminLayout } from "../templates/AdminLayout";
const { useToken } = theme;

const TableToolbar = ({
  selectedRowKeys,
}: {
  isFetchLoading: boolean;
  isUpdateLoading: boolean;
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
        Nhập dữ liệu
      </Button>

      <ProductCategoriesModalCreate />
    </Col>
  </Flex>
);

export const AdminProductCategoriesTablePage = () => {
  const dispatch = useDispatch();
  const { token } = useToken();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.productCategory,
  );

  useEffect(() => {
    dispatch(
      fetchProductCategoriesAction({
        queryParams: {
          page: 0,
          pageSize: 10,
          sort: ["createdAt,desc"],
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading}
        isUpdateLoading={isUpdateLoading}
        selectedRowKeys={selectedRowKeys}
      />
      <Table
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0
              ? (Array.isArray(sorter) ? sorter : [sorter]).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`,
                )
              : ["createdAt,desc"]; // Default sort by createdAt desc

          dispatch(
            fetchProductCategoriesAction({
              queryParams: {
                page: pagination.current ? pagination.current - 1 : 0,
                pageSize: pagination.pageSize,
                sort,
                status:
                  filters && filters["status"]
                    ? (filters["status"][0] as boolean)
                    : undefined,
              },
            }),
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
          name: it.parentProductCategory ? (
            <AvatarInfo
              fullName={"-".repeat(it.level) + it.name}
              avatar={it.thumbnail}
              info={""}
            />
          ) : (
            <div className="text-primary">
              <AvatarInfo
                fullName={it.name}
                avatar={it.thumbnail}
                info={""}
              />
            </div>
          ),
          slug: `/${it.slug}`,
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          updatedAt: it.updatedAt
            ? format(new Date(it.updatedAt), "HH:mm:ss - dd/MM/yyyy")
            : "",
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
                      label: (
                        <ProductCategoriesModalEdit productCategorie={it} />
                      ),
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
                        dispatch(deleteProductCategoryAction({ pcid: it.id }))
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
];

const getColumns = () => {
  return [
    {
      title: "STT.",
      dataIndex: "no",
    },
    {
      title: "__________Tên danh mục",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Slug",
      dataIndex: "slug",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
    },
    {
      title: "Hành động",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
