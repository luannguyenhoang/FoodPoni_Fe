import { fetchUsersAction } from "@/redux/modules/user";
import { RootState } from "@/redux/store";
import { getThumbnail } from "@/utils/common";
import { Table, TableColumnsType, Tag } from "antd";
import { format } from "date-fns";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AdminLayout } from "../templates/AdminLayout";

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
          status: it.status? <Tag color="success">Hoạt động</Tag> :<Tag color="error">Bị Chặn</Tag>,
          email: it.email,
          phoneNumber: it.address?.phoneNumber,
          address: it.address?.address,
          createdAt: (it.createdAt ? format(new Date(it.createdAt), "HH:mm:ss - dd/MM/yyyy") : ""),
        }))}
        size="small"
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
      sorter: {
        multiple: 2,
      },
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
          text: "Bị chặn",
          value: false,
        },
      ],
    },
    {
      title: "Email",
      dataIndex: "email",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 2,
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      showSorterTooltip: { target: "full-header" },
      
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      width: 250, 
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      showSorterTooltip: { target: "full-header" },
      sorter: {
        multiple: 1,
      },
    },
  ] as TableColumnsType;
};
