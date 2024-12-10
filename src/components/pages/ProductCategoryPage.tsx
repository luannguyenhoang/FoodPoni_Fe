import { useDispatch, useSelector } from "react-redux";
import { Params, useParams } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { useEffect } from "react";
import { Col, Pagination, Row } from "antd";
import { ProductLoading } from "@/components/atoms/ProductLoading";
import { ProductCard } from "@/components/molecules/ProductCard";
import { fetchProductsByProductCategoryAction } from "@/redux/modules/product.ts";
import EmptyNotice from "@/components/atoms/EmptyNotice";
import { SidebarLayout } from "../templates/SidebarLayout";
import ProductCategory from "../molecules/ProductCategory";

export const ProductCategoryPage = () => {
  const { pathVariable } = useParams<Params<string>>();
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.product
  );

  useEffect(() => {
    if (pathVariable) {
      dispatch(
        fetchProductsByProductCategoryAction({
          pathVariable,
          queryParams: { page: 0, pageSize: 10, status: true },
        })
      );
    }
  }, [dispatch, pathVariable]);

  if (isFetchLoading) {
    return (
      <SidebarLayout sidebarContents={[<ProductCategory />]}>
        <ProductLoading />
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout sidebarContents={[<ProductCategory />]}>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Món ăn trong danh mục
        </h1>
        {page.content.length === 0 ? (
          <EmptyNotice
            w="60"
            h="60"
            src="/emty-3.png"
            message="Không có món ăn nào"
          />
        ) : (
          <div>
            <Row gutter={[16, 24]}>
              {page.content.map((product) => (
                <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
                  <ProductCard key={product.id} product={product} />
                </Col>
              ))}
            </Row>
            <div className="mt-8 flex justify-center">
              <Pagination
                current={page.number}
                total={page.totalElements}
                pageSize={page.size}
                onChange={() => {}}
                showSizeChanger={false}
              />
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
};
