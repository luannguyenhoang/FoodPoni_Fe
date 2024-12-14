import { fetchUsersAction, updateRoleAction } from "@/redux/modules/user";
import { RootState } from "@/redux/store";
import { getThumbnail } from "@/utils/common";
import { Popconfirm, Table, TableColumnsType, Tag } from "antd";
import { format } from "date-fns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AdminLayout } from "../templates/AdminLayout";
import { ArrowUpOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import Button from "antd-button-color";

export const AdminUserTablePage = () => {
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(
      fetchUsersAction({
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
      <Table
        onChange={(pagination, filters, sorter) => {
          const sort =
            sorter && Object.keys(sorter).length > 0
              ? (Array.isArray(sorter) ? sorter : [sorter]).map(
                  (it) =>
                    `${it.field},${it.order === "ascend" ? "asc" : "desc"}`
                )
              : ["createdAt,desc"];

          dispatch(
            fetchUsersAction({
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
          username: (
            <AvatarInfo
              fullName={it.username}
              avatar={getThumbnail(it.avatar)}
              info={it.address?.fullName}
            />
          ),
          status: it.status ? (
            <Tag color="success">Hoạt động</Tag>
          ) : (
            <Tag color="error">Bị khóa</Tag>
          ),
          email: it.email,
          phoneNumber: it.address?.phoneNumber,
          role:
            it.role === "CUSTOMER" ? (
              <Tag>Khách thường</Tag>
            ) : (
              <Tag icon={<SafetyCertificateOutlined />} color="success">
                Khách quen
              </Tag>
            ),
          createdAt: it.createdAt
            ? format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy")
            : "",
          action: (
            <>
              {it.role === "CUSTOMER" && it.status && (
                <Popconfirm
                  title="Bạn có chắc chắn muốn nâng cấp tài khoản này không?"
                  onConfirm={() =>
                    dispatch(updateRoleAction({ id: it.id, role: "VIP" }))
                  }
                >
                  <Button
                    icon={<ArrowUpOutlined />}
                    type="success"
                    size="small"
                    loading={it.isUpdateRoleLoading}
                  >
                    Nâng cấp tài khoản
                  </Button>
                </Popconfirm>
              )}
            </>
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
      title: "Tên người dùng",
      dataIndex: "username",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: true,
    },
    {
      title: "Cấp bậc",
      dataIndex: "role",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      filters: [
        {
          text: "Hoạt động",
          value: true,
        },
        {
          text: "Bị khóa",
          value: false,
        },
      ],
    },
    {
      title: "Hành động",
      dataIndex: "action",
    },
  ] as TableColumnsType;
};
