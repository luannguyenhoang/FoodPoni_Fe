import { ProductCard } from "@/components/molecules/ProductCard";
import { RootState } from "@/redux/store.ts";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Action } from "redux";
import { ProductLoading } from "../atoms/ProductLoading";
import { Pagination } from "antd";
import { fetchProductsAction } from "@/redux/modules/product";
import EmptyNotice from "../atoms/EmptyNotice";

interface ProductFilterRowProps {
  title?: string | ReactNode;
  action: Action;
  legacyBehavior?: boolean;
  hasBorder?: boolean;
  children?: ReactNode;
}

export function ProductRows({
  children,
  title,
  action,
  legacyBehavior,
  hasBorder = true,
}: ProductFilterRowProps) {
  const dispatch = useDispatch();
  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.product
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    dispatch(action);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, action]);

  return (
    <div
      className={`p-4 bg-white rounded-lg ${hasBorder ? "border-2 border-orange-400" : ""}`}
    >
      {children}
      <div className="flex justify-between items-end">
        <div className="font-bold text-xl">{title}</div>
        {legacyBehavior && (
          <Link to="/hot-sale" className="flex justify-start ">
            <div className="flex items-end text-end h-full text-orange-400 hover:text-orange-500 cursor-pointer">
              Xem thêm
            </div>
          </Link>
        )}
      </div>
      <div style={{ maxWidth: "59rem", margin: "auto" }}>
        {isFetchLoading ? (
          <ProductLoading />
        ) : page.content?.length === 0 ? (
          <EmptyNotice
            w="60"
            h="60"
            src="/emty-3.png"
            message="Không có món ăn nào"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-2 mt-3">
            {page.content.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
          </div>
        )}
      </div>
      {!isFetchLoading && (
        <Pagination
          total={page.totalElements}
          pageSize={12}
          current={currentPage}
          onChange={(page: number) => {
            setCurrentPage(page);
            dispatch(
              fetchProductsAction({
                queryParams: {
                  page: page - 1,
                  pageSize: 12,
                  sort: ["sales,desc"],
                  status: true,
                },
              })
            );
          }}
          showSizeChanger={false}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} sản phẩm`
          }
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem",
          }}
        />
      )}
    </div>
  );
}
