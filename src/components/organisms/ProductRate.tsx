import { fetchProductRatePercentAction } from "@/redux/modules/product.ts";
import { getRatesAction } from "@/redux/modules/rate";
import { RootState } from "@/redux/store";
import { ProductDetail } from "@/type/types";
import { getThumbnail } from "@/utils/common.ts";
import { CheckCircleFilled, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Image, List, Progress, Rate } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import EmptyNotice from "../atoms/EmptyNotice.tsx";

const REVIEW_TEXTS = [
  "Rất không hài lòng",
  "Không hài lòng",
  "Bình thường",
  "Hài lòng",
  "Cực kì hài lòng",
];

const getReviewText = (rate: number) => REVIEW_TEXTS[rate - 1] || "";

type Props = {
  productDetail: ProductDetail;
};

export default function ProductRate({ productDetail }: Props) {
  const dispatch = useDispatch();
  const { page, isLoading } = useSelector((state: RootState) => state.rate);

  useEffect(() => {
    dispatch(
      getRatesAction({
        productId: productDetail.id,
        queryParams: { page: 0, pageSize: 5 },
      })
    );
  }, [dispatch, productDetail]);

  useEffect(() => {
    dispatch(fetchProductRatePercentAction({ pdid: productDetail.id }));
  }, [dispatch, productDetail.id]);

  const { ratePercents } = useSelector((state: RootState) => state.product);

  return (
    <Card size="small">
      <h2 className="text-xl font-medium">Khách hàng đánh giá</h2>
      <h3 className="my-2 text-base font-medium">Tổng quan</h3>
      <div className="flex flex-wrap gap-2 text-4xl items-center">
        <div>{productDetail.rate?.toFixed(1) || 0}</div>
        <Rate
          style={{ fontSize: "30px" }}
          allowHalf
          disabled
          value={productDetail?.rate}
        />
      </div>
      <div className="my-2 text-gray-400">
        ({productDetail.rateCount} đánh giá)
      </div>
      {[5, 4, 3, 2, 1].map((rt) => {
        const rateData = ratePercents.find((item) => item.star === rt) || {
          star: rt,
          total: 0,
          percent: 0,
        };

        return (
          <div key={rt} className="flex flex-wrap gap-1 text-gray-400">
            <Rate disabled value={rt} />
            <Progress
              style={{ maxWidth: "100%", width: "13%" }}
              percent={Number(rateData.percent)}
              showInfo={false}
            />
            <div>{rateData.total}</div>
          </div>
        );
      })}
      <hr className="my-6" />
      <List
        loading={isLoading}
        itemLayout="vertical"
        size="large"
        locale={{
          emptyText: (
            <EmptyNotice
              h="40"
              w="48"
              src="/emty-3.png"
              message="Chưa có đánh giá"
            />
          ),
        }}
        pagination={
          productDetail.rateCount === 0
            ? false
            : {
                position: "bottom",
                align: "center",
                onChange: (page) => {
                  dispatch(
                    getRatesAction({
                      productId: productDetail.id,
                      queryParams: { page: page - 1, pageSize: 5 },
                    })
                  );
                },
                pageSize: 5,
                total: page.totalElements || 0,
              }
        }
        dataSource={page.content || []}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <div className="grid grid-cols-1 md:grid-cols-10 gap-4">
              <div className="col-span-1 md:col-span-2">
                <div className="flex gap-2">
                  <Avatar
                    src={
                      item.avatar ? (
                        getThumbnail(item.avatar)
                      ) : (
                        <Avatar icon={<UserOutlined />} />
                      )
                    }
                    className="w-10 h-10"
                  />
                  <div>
                    <Link to={`/user/${item.username}`}>
                      <span className="text-black-800 font-sans text-base">
                        {item.username}
                      </span>
                    </Link>
                    <div className="text-xs font-sans text-gray-400">
                      Đã mua {productDetail.product.name + " - " + item.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-8">
                <div className="font-medium text-base gap-2 flex flex-wrap">
                  <Rate allowHalf disabled value={item.rate} />
                  {getReviewText(item.rate)}
                </div>
                <div className="text-green-500 gap-1 flex">
                  <CheckCircleFilled />
                  Đã nhận hàng
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="text-sm font-normal my-3">{item.message}</div>
                </div>
                <div className="flex flex-wrap">
                  {item.images?.map((url, imgIndex) => (
                    <div key={imgIndex} className="mr-[10px] mb-[10px]">
                      <Image
                        src={getThumbnail(url)}
                        alt={`Image ${imgIndex}`}
                        width={70}
                        height={70}
                        className="object-cover cursor-pointer rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = getThumbnail("");
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
}
