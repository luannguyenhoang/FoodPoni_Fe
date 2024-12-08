import { ProductDetail } from "@/type/types";
import { CloseOutlined } from "@ant-design/icons";
import { Modal, Spin } from "antd";
import { useState, useMemo } from "react";
import { ProductDetailForm } from "../molecules/ProductDetailForm";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export const ProductDetailModalEdit = ({
  productDetail: initialProductDetail,
}: {
  productDetail: ProductDetail;
}) => {
  const [isOpen, setOpen] = useState(false);
  const { isFetchLoading, isUpdateLoading, page } = useSelector(
    (state: RootState) => state.productDetail
  );

  const updatedProductDetail = useMemo(() => {
    return page.content.find((item) => item.id === initialProductDetail.id);
  }, [page.content, initialProductDetail.id]);

  return (
    <>
      <div onClick={() => setOpen(!isOpen)}>
        {isOpen ? (
          <>
            <CloseOutlined /> "Đóng"
          </>
        ) : (
          "Cập nhật"
        )}{" "}
        món ăn chi tiết
      </div>
      <Modal
        title="Cập nhật món ăn chi tiết"
        open={isOpen}
        onCancel={() => setOpen(false)}
        width={700}
        footer={null}
      >
        <Spin spinning={isFetchLoading || isUpdateLoading}>
          <ProductDetailForm
            productDetailProp={updatedProductDetail || initialProductDetail}
          />
        </Spin>
      </Modal>
    </>
  );
};
