import { Product } from "@/type/types";
import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { ProductForm } from "../molecules/ProductForm";

export const ProductModalEdit = ({ product }: { product?: Product }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(!isOpen)}>
        {isOpen ? (
          <>
            <CloseOutlined /> "Đóng"
          </>
        ) : (
          "Sửa"
        )}{" "}
        món ăn
      </div>
      <Modal title="Sửa món ăn" open={isOpen} onCancel={() => setOpen(false)} width={700} footer={null}>
        <ProductForm product={product} />
      </Modal>
    </>
  );
};
