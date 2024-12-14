import { fetchProductAction } from "@/redux/modules/product";
import {
  deleteProductDetailAction,
  fetchProductDetailAction,
  updateProductDetailStatusAction,
} from "@/redux/modules/productDetail";
import { RootState } from "@/redux/store";
import { currencyFormat } from "@/utils/common";
import {
  CloseCircleOutlined,
  CopyOutlined,
  DashOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  ImportOutlined
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Col,
  Divider,
  Dropdown,
  Flex,
  Popconfirm,
  Rate,
  Table,
  TableColumnsType,
  Tag,
  theme,
} from "antd";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AvatarsInfo } from "../atoms/AvatarsInfo";
import { ProductDetailModalCreate } from "../organisms/ProductDetailModalCreate";
import { ProductDetailModalEdit } from "../organisms/ProductDetailModalEdit";
import { AdminLayout } from "../templates/AdminLayout";
const { useToken } = theme;

const TableToolbar = ({
  isFetchLoading,
  isUpdateLoading,
  selectedRowKeys,
  onDeleteAll,
  productName,
}: {
  isFetchLoading: boolean;
  isUpdateLoading: boolean;
  selectedRowKeys: Array<React.Key>;
  onDeleteAll: () => void;
  productName: string;
}) => (
  <Flex className="mb-4" justify="space-between">
    <Col>
      {selectedRowKeys.length > 0 ? (
        <Popconfirm
          title="Delete selected items?"
          description="This action cannot be undone."
          onConfirm={onDeleteAll}
          disabled={isUpdateLoading}
        >
          <Button
            className="bg-red-500 text-white"
            type="default"
            icon={<CloseCircleOutlined />}
            style={{ marginRight: "10px" }}
            loading={isUpdateLoading}
            disabled={isFetchLoading || isUpdateLoading}
          >
            Xóa hết
            <Badge
              className="absolute -top-3 -right-2"
              count={selectedRowKeys.length}
            />
          </Button>
        </Popconfirm>
      ) : (
        <h2 className="text-lg nunito text-primary">
          <span className="text-black">Món ăn:</span> {productName}
        </h2>
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

      <ProductDetailModalCreate />
    </Col>
  </Flex>
);

export const AdminProductDetailTablePage = () => {
  const { pid } = useParams();
  const dispatch = useDispatch();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { token } = useToken();
  const { page, isFetchLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.productDetail
  );
  const { productSelected } = useSelector((state: RootState) => state.product);

  useEffect(() => {
    if (pid) {
      dispatch(fetchProductAction({ pathVariable: pid }));
      dispatch(
        fetchProductDetailAction({
          pathVariable: pid,
          queryParams: {
            page: 0,
            pageSize: 10,
            sort: ["createdAt,desc"],
          },
        })
      );
    }
  }, [dispatch, pid]);

  const handleBulkDelete = () => {
    if (pid) {
      selectedRowKeys.forEach((key) => {
        dispatch(
          deleteProductDetailAction({ pdid: key.toString(), productId: pid })
        );
      });
      setSelectedRowKeys([]);
    }
  };

  return (
    <AdminLayout>
      <TableToolbar
        isFetchLoading={isFetchLoading}
        isUpdateLoading={isUpdateLoading}
        selectedRowKeys={selectedRowKeys}
        onDeleteAll={handleBulkDelete}
        productName={productSelected.product.name}
      />
      <Table
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0
              ? (Array.isArray(sorter) ? sorter : [sorter]).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`
                )
              : ["createdAt,desc"];

          if (pid) {
            dispatch(
              fetchProductDetailAction({
                pathVariable: pid,
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
          }
        }}
        pagination={{
          total: page.totalElements,
          pageSize: page.size,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total) => `Tổng ${total} mục`,
          size: "default",
        }}
        loading={isFetchLoading || isUpdateLoading}
        rowSelection={{
          selectedRowKeys,
          onChange: (newSelectedRowKeys) =>
            setSelectedRowKeys(newSelectedRowKeys),
        }}
        columns={getColumns()}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: index + 1,
          name: (
            <AvatarsInfo
              fullName={productSelected.product.name + " - " + it.name}
              avatars={it.images}
              info={``}
            />
          ),
          price: currencyFormat(it.price),
          status: it.status,
          rate: it.rate,
          rateCount: it.rateCount,
          createdAt: format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy"),
          actions: (
            <Dropdown
              trigger={["click"]}
              menu={{
                items: tableRowActions.map((item) => {
                  if (item.key === "1") {
                    return {
                      ...item,
                      label: <ProductDetailModalEdit productDetail={it} />,
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
                    style: { boxShadow: "none" },
                  })}
                  <Divider style={{ margin: 0 }} />
                  <div style={{ padding: 8 }}>
                    <Popconfirm
                      title={
                        it.status ? "Bạn có muốn ẩn?" : "Bạn có muốn hiển thị?"
                      }
                      onConfirm={() =>
                        dispatch(
                          updateProductDetailStatusAction({
                            pdid: it.id,
                            status: !it.status,
                          })
                        )
                      }
                    >
                      <Button
                        className="w-full justify-start"
                        type={it.status ? "primary" : "default"}
                        loading={isUpdateLoading}
                      >
                        {it.status ? (
                          <>
                            <EyeOutlined /> Ẩn
                          </>
                        ) : (
                          <>
                            <EyeInvisibleOutlined /> Hiển thị
                          </>
                        )}
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
  {
    key: "3",
    icon: <EyeOutlined />,
    label: "Preview Card",
  },
];

const getColumns = () => {
  return [
    {
      title: "STT",
      dataIndex: "no",
    },
    {
      title: "Tên món ăn chi tiết",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 6,
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 5,
      },
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      showSorterTooltip: { target: "full-header" },
      render: (rate: number) => <Rate disabled allowHalf value={rate} />,
      sorter: {
        multiple: 3,
      },
    },
    {
      title: "Lượt đánh giá",
      dataIndex: "rateCount",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 1,
      },
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
      render: (status: boolean) => (
        <Tag
          icon={status ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          color={status ? "success" : "error"}
        >
          {status ? "Hiển thị" : "Ẩn"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "actions",
    },
  ] as TableColumnsType;
};
