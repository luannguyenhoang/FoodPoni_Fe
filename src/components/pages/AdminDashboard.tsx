import { fetchOrdersByRetailerAction } from "@/redux/modules/order";
import {
  fetchPopularCategoriesAction,
  fetchPopularProductsAction,
  fetchPopularProductsDetailerAction,
  fetchReviewsAction,
  fetchSalesAction,
  fetchSalesPostpaidAction,
  fetchSalesTotalAction,
  fetchSalesTotalOrderAction,
  fetchSalesTotalUserAction,
  fetchStatisticByRetailerAction,
} from "@/redux/modules/statistic";
import { RootState } from "@/redux/store";
import {
  StatisticReviews,
  StatisticSales,
  StatisticStatus,
} from "@/type/types";
import { currencyFormat } from "@/utils/common";
import { Area, Pie } from "@ant-design/charts";
import { green, lime, orange, red, yellow } from "@ant-design/colors";
import { QuestionOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Flex,
  Popover,
  Progress,
  ProgressProps,
  Rate,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import relativeTime from "dayjs/plugin/relativeTime";
import { CSSProperties, useEffect } from "react";
import CountUp from "react-countup";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AvatarInfo } from "../atoms/AvatarInfo";
import { AvatarsInfo } from "../atoms/AvatarsInfo";
import { AdminLayout } from "../templates/AdminLayout";

const { RangePicker } = DatePicker;

dayjs.extend(relativeTime);
dayjs.locale("vi");

export const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const {
    isFetchLoading,
    isSalesLoading,
    isStatusOrderLoading,
    isPopularProductLoading,
    popularProducts,
    popularCategories,
    popularProductsDetialer,
    totalAmount,
    totalUser,
    totalOrder,
    totalPostpaid,
    isProductsDetialerLoading,
    isPopularCategoriesLoading,
    sales,
    status,
    reviews,
  } = useSelector((state: RootState) => state.statistic);

  useEffect(() => {
    dispatch(fetchPopularProductsAction());
    dispatch(fetchPopularCategoriesAction());
    dispatch(fetchPopularProductsDetailerAction());
    dispatch(fetchSalesAction({}));
    dispatch(fetchSalesTotalAction({}));
    dispatch(fetchSalesTotalUserAction());
    dispatch(fetchStatisticByRetailerAction({}));
    dispatch(fetchSalesPostpaidAction({}));
    dispatch(fetchReviewsAction());
    dispatch(
      fetchSalesTotalOrderAction({
        queryParams: {
          status: "COMPLETED",
        },
      })
    );
  }, [dispatch]);

  return (
    <AdminLayout>
      <Row gutter={[16, 16]}>
        <Col md={24} lg={24} xl={12} xxl={16}>
          <Card
            title="Thống kê"
            extra={
              <Space direction="vertical" size={12}>
                <RangePicker
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      const startDate = dates[0].format("YYYY-MM-DD HH:mm:ss");
                      const endDate = dates[1].format("YYYY-MM-DD HH:mm:ss");
                      dispatch(
                        fetchSalesTotalAction({
                          queryParams: {
                            startDate,
                            endDate,
                          },
                        })
                      );
                      dispatch(
                        fetchSalesTotalOrderAction({
                          queryParams: {
                            startDate,
                            endDate,
                            status: "COMPLETED",
                          },
                        })
                      );
                    }
                  }}
                />
              </Space>
            }
            style={cardStyles}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <RevenueCard
                  loading={isFetchLoading}
                  title="Doanh số"
                  value={currencyFormat(totalAmount)}
                  height={180}
                  justify="space-between"
                />
              </Col>
              <Col xs={24} sm={12}>
                <RevenueCard
                  loading={isFetchLoading}
                  title="Đơn hàng"
                  value={totalOrder}
                  height={180}
                  justify="space-between"
                />
              </Col>
              <Col xs={24} sm={12}>
                <RevenueCard
                  loading={isFetchLoading}
                  title="Phiếu nợ"
                  value={totalPostpaid}
                  height={180}
                  justify="space-between"
                />
              </Col>
              <Col xs={24} sm={12}>
                <RevenueCard
                  loading={isFetchLoading}
                  title="Khách hàng"
                  value={totalUser}
                  height={180}
                  justify="space-between"
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col md={24} lg={12} xl={12} xxl={8}>
          <CustomerOrder />
        </Col>
        <Col md={24} lg={12} xl={12} xxl={12}>
          <Card
            title="Tổng doanh số bán hàng"
            extra={
              <Space direction="vertical" size={12}>
                <DatePicker
                  onChange={(dates) => {
                    if (dates) {
                      const year = dates.format("YYYY");
                      dispatch(
                        fetchSalesAction({
                          queryParams: {
                            year,
                          },
                        })
                      );
                    }
                  }}
                  picker="year"
                />
              </Space>
            }
            style={cardStyles}
          >
            <Flex vertical gap="middle">
              <SalesChart isFetchLoading={isSalesLoading} sales={sales} />
            </Flex>
          </Card>
        </Col>
        <Col md={24} lg={12} xl={12} xxl={12}>
          <Card
            title="Trạng thái đơn hàng"
            extra={
              <Space direction="vertical" size={12}>
                <RangePicker
                  onChange={(dates) => {
                    if (dates && dates[0] && dates[1]) {
                      const startDate = dates[0].format("YYYY-MM-DD HH:mm:ss");
                      const endDate = dates[1].format("YYYY-MM-DD HH:mm:ss");
                      dispatch(
                        fetchStatisticByRetailerAction({
                          queryParams: {
                            startDate,
                            endDate,
                          },
                        })
                      );
                    }
                  }}
                />
              </Space>
            }
            style={cardStyles}
          >
            <OrdersStatusChart
              isFetchLoading={isStatusOrderLoading}
              status={status}
            />
          </Card>
        </Col>
        <Col md={24} lg={24} xl={12} xxl={12}>
          <Card title="Món ăn phổ biến" style={cardStyles}>
            <Table
              scroll={{ x: "max-content" }}
              pagination={false}
              columns={PRODUCTS_COLUMNS()}
              dataSource={popularProducts.map((it, index) => ({
                ...it,
                key: it.id,
                no: index + 1,
                name: (
                  <Link to={`/admin/product-details/${it.id}`}>
                    <AvatarInfo
                      fullName={it.name}
                      avatar={it.thumbnail}
                      info={`/${it.slug}`}
                    />
                  </Link>
                ),
                sales: it.sales,
              }))}
              loading={isPopularProductLoading}
              size="small"
            />
          </Card>
        </Col>
        <Col md={24} lg={24} xl={12} xxl={12}>
          <Card title="Món ăn chi tiết bán chạy nhất">
            <Table
              scroll={{ x: "max-content" }}
              pagination={false}
              loading={isProductsDetialerLoading}
              columns={SELLER_COLUMNS()}
              dataSource={popularProductsDetialer.map((it, index) => ({
                ...it,
                key: it.id,
                no: index + 1,
                name: (
                  <AvatarsInfo
                    fullName={it.product.name + " - " + it.name}
                    avatars={it.images}
                    info={``}
                  />
                ),
                price: currencyFormat(it.price),
                rate: it.rate,
                sales: it.sales,
              }))}
              size="small"
            />
          </Card>
        </Col>
        <Col md={24} lg={24} xl={12} xxl={12}>
          <Card title="Danh mục phổ biến" style={cardStyles}>
            <Table
              scroll={{ x: "max-content" }}
              pagination={false}
              loading={isPopularCategoriesLoading}
              columns={CATEGORIES_COLUMNS()}
              dataSource={popularCategories.map((it, index) => ({
                ...it,
                key: it.id,
                no: index + 1,
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
              }))}
              size="small"
            />
          </Card>
        </Col>
        <Col md={24} lg={24} xl={12} xxl={12}>
          <CustomerReviews isFetchLoading={isFetchLoading} reviews={reviews} />
        </Col>
      </Row>
    </AdminLayout>
  );
};

export const CustomerReviews = ({
  isFetchLoading,
  reviews,
}: {
  isFetchLoading: boolean;
  reviews: StatisticReviews;
}) => {
  const PROGRESS_PROPS: ProgressProps = {
    style: {
      width: 300,
    },
  };

  if (isFetchLoading || !reviews) {
    return <Spin />;
  }

  return (
    <Card
      title="Người dùng đánh giá"
      extra={
        <Popover content="Overall rating of 5k reviews" title="Review ratings">
          <Button icon={<QuestionOutlined />} size="small" type="text" />
        </Popover>
      }
      actions={[<Button>Xem tất cả</Button>]}
    >
      <Flex vertical gap="middle">
        <Flex vertical gap="small">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>Excellent</Typography.Text>
            <Progress
              percent={
                reviews?.Excellent ? Number(reviews.Excellent.toFixed(2)) : 0
              }
              strokeColor={lime[6]}
              {...PROGRESS_PROPS}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>Good</Typography.Text>
            <Progress
              percent={
                reviews?.readonlyGood
                  ? Number(reviews.readonlyGood.toFixed(2))
                  : 0
              }
              strokeColor={green[5]}
              {...PROGRESS_PROPS}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>Average</Typography.Text>
            <Progress
              percent={
                reviews?.Average ? Number(reviews.Average.toFixed(2)) : 0
              }
              strokeColor={yellow[6]}
              {...PROGRESS_PROPS}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>Poor</Typography.Text>
            <Progress
              percent={reviews?.Poor ? Number(reviews.Poor.toFixed(2)) : 0}
              strokeColor={orange[5]}
              {...PROGRESS_PROPS}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography.Text>Critical</Typography.Text>
            <Progress
              percent={
                reviews?.Critical ? Number(reviews.Critical.toFixed(2)) : 0
              }
              strokeColor={red[6]}
              {...PROGRESS_PROPS}
            />
          </div>
        </Flex>
      </Flex>
    </Card>
  );
};

export const CustomerOrder = () => {
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(
      fetchOrdersByRetailerAction({
        queryParams: {
          page: 0,
          pageSize: 5,
          sort: ["createdAt,desc"],
        },
      })
    );
  }, [dispatch]);

  return (
    <Card
      title="Đơn hàng gần đây"
      actions={[
        <Link to="/admin/orders-table">
          <Button>Xem tất cả</Button>
        </Link>,
      ]}
    >
      <Table
        scroll={{ x: "max-content" }}
        pagination={false}
        loading={isFetchLoading}
        columns={ORDERS_COLUMNS()}
        dataSource={page.content.map((it, index) => ({
          ...it,
          key: it.id,
          no: page.number * page.size + index + 1,
          code: "#" + it.id.toUpperCase().substring(0, 6),
          name: (
            <AvatarInfo
              fullName={it.shippingAddress.fullName}
              avatar={it.user && it.user.avatar}
              info={`${it.user ? it.user.username : ""}`}
            />
          ),
          time: dayjs(it.createdAt).fromNow(),
        }))}
        size="small"
      />
    </Card>
  );
};
const SalesChart = ({
  isFetchLoading,
  sales,
}: {
  isFetchLoading: boolean;
  sales: StatisticSales | null;
}) => {
  if (!sales) {
    return <Area loading={isFetchLoading} />;
  }
  const data = [
    { revenue: "Doanh thu", month: "Tháng Một", value: sales.JANUARY },
    { revenue: "Doanh thu", month: "Tháng Hai", value: sales.FEBRUARY },
    { revenue: "Doanh thu", month: "Tháng Ba", value: sales.MARCH },
    { revenue: "Doanh thu", month: "Tháng Tư", value: sales.APRIL },
    { revenue: "Doanh thu", month: "Tháng Năm", value: sales.MAY },
    { revenue: "Doanh thu", month: "Tháng Sáu", value: sales.JUNE },
    { revenue: "Doanh thu", month: "Tháng Bảy", value: sales.JULY },
    { revenue: "Doanh thu", month: "Tháng Tám", value: sales.AUGUST },
    { revenue: "Doanh thu", month: "Tháng Chín", value: sales.SEPTEMBER },
    { revenue: "Doanh thu", month: "Tháng Mười", value: sales.OCTOBER },
    { revenue: "Doanh thu", month: "Tháng Mười Một", value: sales.NOVEMBER },
    { revenue: "Doanh thu", month: "Tháng Mười Hai", value: sales.DECEMBER },
  ];

  const config = {
    data,
    xField: "month",
    yField: "value",
    seriesField: "revenue",
    slider: {
      start: 0.1,
      end: 0.9,
    },
  };

  return <Area {...config} loading={isFetchLoading} />;
};
const OrdersStatusChart = ({
  isFetchLoading,
  status,
}: {
  isFetchLoading: boolean;
  status: StatisticStatus | null;
}) => {
  if (!status || isFetchLoading) {
    return <Area loading={isFetchLoading} />;
  }

  const data = [
    { type: "Từ chối", value: status.REJECTED },
    // { label: "Đang giao", key: "DELIVERING" },
    { type: "Đã hủy", value: status.CANCELLED },
    { type: "Gặp sự cố", value: status.FAILED },
    { type: "Đã nhận hàng", value: status.COMPLETED },
  ];

  const config = {
    appendPadding: 10,
    data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }: { percent: number }) =>
        `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return <Pie {...config} />;
};

const PRODUCTS_COLUMNS = () => {
  return [
    {
      title: "STT.",
      dataIndex: "no",
    },
    {
      title: "Tên món ăn",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Lượt bán",
      dataIndex: "sales",
    },
  ] as TableColumnsType;
};

const CATEGORIES_COLUMNS = () => {
  return [
    {
      title: "STT.",
      dataIndex: "no",
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Slug",
      dataIndex: "slug",
      showSorterTooltip: { target: "full-header" },
    },
  ] as TableColumnsType;
};

const SELLER_COLUMNS = () => {
  return [
    {
      title: "STT.",
      dataIndex: "no",
    },
    {
      title: "Tên món ăn chi tiết",
      dataIndex: "name",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Giá",
      dataIndex: "price",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Đánh giá",
      dataIndex: "rate",
      showSorterTooltip: { target: "full-header" },
      render: (rate: number) => <Rate disabled allowHalf value={rate} />,
    },
    {
      title: "Số lượng đã bán",
      dataIndex: "sales",
      showSorterTooltip: { target: "full-header" },
    },
  ] as TableColumnsType;
};

const ORDERS_COLUMNS = () => {
  return [
    {
      title: "STT.",
      dataIndex: "no",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      showSorterTooltip: { target: "full-header" },
    },
    {
      title: "Khách hàng",
      dataIndex: "name",
    },
    {
      title: "Thời gian",
      dataIndex: "time",
    },
  ] as TableColumnsType;
};

const cardStyles: CSSProperties = {
  height: "100%",
};

export const RevenueCard = (props: {
  title: string;
  value: string | number | [];
  justify?: CSSProperties["justifyContent"];
  height?: number;
  loading?: boolean;
}) => {
  const { title, value, justify, height, loading } = props;

  return (
    <Card loading={loading}>
      <Flex
        vertical
        gap={justify ? 0 : "large"}
        justify={justify}
        style={{ height: height ? height - 60 : "auto" }}
      >
        <Typography.Text>{title}</Typography.Text>
        <Flex justify="space-between" align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>
            {typeof value === "number" ? (
              <>
                <CountUp end={value} />
              </>
            ) : (
              <span>{value}</span>
            )}
          </Typography.Title>
        </Flex>
      </Flex>
    </Card>
  );
};
