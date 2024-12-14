import { Topping } from "@/type/types";
import { CloseOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import { useState } from "react";
import { ToppingForm } from "../molecules/ToppingForm";

export const ToppingModalEdit = ({ topping }: { topping?: Topping }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(!isOpen)}>
        {isOpen ? (
          <>
            <CloseOutlined /> "Close"
          </>
        ) : (
          "Sửa"
        )}{" "}
        Topping
      </div>
      <Modal
        title="Sửa"
        open={isOpen}
        onCancel={() => setOpen(false)}
        width={700}
        footer={null}
      >
        <ToppingForm topping={topping} />
      </Modal>
    </>
  );
};
