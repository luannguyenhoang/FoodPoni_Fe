import { fetchProductCategoriesRequest } from "@/redux/modules/productCategory.ts";
import { RootState } from "@/redux/store.ts";
import { server } from "@/utils/server.ts";
import { Menu } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ProductLoading } from "../atoms/ProductLoading";

export default function ProductCategory() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.productCategory
  );

  useEffect(() => {
    dispatch(fetchProductCategoriesRequest());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-white rounded-lg">
      <div className="px-4 pt-4 pb-2">Danh mục</div>
      {isFetchLoading ? (
        <ProductLoading />
      ) : (
        <Menu
          className="rounded-lg !border-none"
          defaultSelectedKeys={["all"]}
          mode="inline"
          items={page.content.map((it, index) => {
            return {
              key: index,
              label: (
                <span
                  className="flex items-center"
                  onClick={() => navigate(`/danh-muc/${it.slug}`)}
                >
                  <img src={server + it.thumbnail} className="w-4 h-4 mr-2" />
                  <span
                    className={`${it.parentProductCategory === null ? "font-bold uppercase" : ""}`}
                  >
                    {it.name}
                  </span>
                </span>
              ),
            };
          })}
        />
      )}
    </div>
  );
}
