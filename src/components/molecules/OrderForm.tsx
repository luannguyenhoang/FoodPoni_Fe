import { Button, Form, Popconfirm } from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import { PaymentSelector } from "../organisms/PaymentSelector";
import { ShippingAddressSelector } from "../organisms/ShippingAddressSelector";
import { ScrollPane } from "@/components/atoms/ScrollPane.tsx";

export type OrderRequest = {
  addressId: string;
  note: string;
  paymentMethod: "CASH" | "VNPAY" | "MOMO" | "POSTPAID";
};

export const OrderForm = ({
  currentUserRole,
  currentUserAddressId,
  isCreateLoading,
  calculateShippingFee,
  onSubmit,
}: {
  currentUserRole: "VIP" | "CUSTOMER" | "RETAILER";
  currentUserAddressId: string;
  isCreateLoading: boolean;
  calculateShippingFee: (addressId: string) => void;
  onSubmit: (values: OrderRequest) => void;
}) => {
  const [form] = useForm<OrderRequest>();
  return (
    <Form
      form={form}
      onFinish={(values) => onSubmit(values)}
      initialValues={{
        addressId: currentUserAddressId,
        paymentMethod: "CASH",
        shippingMethod: "FREE",
      }}
    >
      <ScrollPane maxHeight="max-h-[333px]">
        <Form.Item name="addressId">
          <ShippingAddressSelector
            value={form.getFieldValue("addressId")}
            onOk={(value) => {
              form.setFieldValue("addressId", value);
              calculateShippingFee(value);
            }}
          />
        </Form.Item>
        <Form.Item name="paymentMethod">
          <PaymentSelector
            value={form.getFieldValue("paymentMethod")}
            currentUserRole={currentUserRole}
            onSelected={(value) => form.setFieldValue("paymentMethod", value)}
          />
        </Form.Item>
        <Form.Item name="note">
          <TextArea placeholder="Ghi chú" />
        </Form.Item>
      </ScrollPane>
      <Form.Item className="mb-0">
        <Popconfirm
          title="Bạn có chắc chắn muốn đặt hàng không?"
          onConfirm={() => form.submit()}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          <Button
            type="primary"
            htmlType="button"
            danger
            block
            loading={isCreateLoading}
          >
            Thanh toán
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
