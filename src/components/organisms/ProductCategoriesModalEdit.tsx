import { ProductCategory } from "@/type/types";
import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { ProductCategoriesForm } from "../molecules/ProductCategoriesForm";

export const ProductCategoriesModalEdit = ({
  productCategorie,
}: {
  productCategorie?: ProductCategory;
}) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(!isOpen)}>
        {isOpen ? (
          <>
            <CloseOutlined /> "Đóng"
          </>
        ) : (
          "Chỉnh sửa"
        )}
      </div>
      <Modal
        title="Sửa"
        open={isOpen}
        onCancel={() => setOpen(false)}
        width={700}
        footer={null}
      >
        <ProductCategoriesForm productCategorie={productCategorie} />
      </Modal>
    </>
  );
};
