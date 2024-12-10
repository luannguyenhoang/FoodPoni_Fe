import { fetchProductCategoriesAction } from "@/redux/modules/productCategory.ts";
import { RootState } from "@/redux/store.ts";
import { Menu } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ProductLoading } from "../atoms/ProductLoading";
import { getThumbnail } from "@/utils/common";

export default function ProductCategory() {
  const navigate = useNavigate();
  const { pathVariable } = useParams();
  const dispatch = useDispatch();

  const { page, isFetchLoading } = useSelector(
    (state: RootState) => state.productCategory
  );

  useEffect(() => {
    dispatch(fetchProductCategoriesAction({}));
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
          defaultSelectedKeys={[pathVariable ?? "all"]}
          mode="inline"
          items={page.content.map((it) => {
            return {
              key: it.slug,
              label: (
                <span
                  className="flex items-center"
                  onClick={() => navigate(`/danh-muc/${it.slug}`)}
                >
                  <img
                    src={getThumbnail(it.thumbnail)}
                    className="w-4 h-4 mr-2"
                  />
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
