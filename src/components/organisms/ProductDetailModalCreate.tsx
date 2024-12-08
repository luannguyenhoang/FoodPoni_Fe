import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popover } from "antd";
import { useState } from "react";
import { ProductDetailForm } from "../molecules/ProductDetailForm";

export const ProductDetailModalCreate = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <Popover
      title="Thêm món ăn chi tiết "
      open={isOpen}
      content={
        <div className="w-[600px]">
          <ProductDetailForm />
        </div>
      }
      trigger="click"
      placement="bottomRight"
    >
      <Button
        type="primary"
        icon={isOpen ? <CloseOutlined /> : <PlusOutlined />}
        style={{ marginRight: "10px" }}
        onClick={() => setOpen(!isOpen)}
      >
        {isOpen ? "Đóng" : "Thêm món ăn chi tiết "}
      </Button>
    </Popover>
  );
};
