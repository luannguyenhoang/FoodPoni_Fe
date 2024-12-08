import { Button, Form, Input, Popconfirm, InputNumber } from "antd";
import { useForm } from "antd/es/form/Form";
import { ImagesSelector } from "./ImagesSelector";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { ProductDetail } from "@/type/types";
import { useEffect } from "react";
import {
  createProductDetailAction,
  updateProductDetailAction,
} from "@/redux/modules/productDetail";
import { useLocation } from "react-router-dom";

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export type ProductDetailFormState = {
  id: string;
  name: string;
  price: number;
  description: string;
  status: boolean;
  images: Array<string>;
  productId: string;
};

export const ProductDetailForm = ({
  productDetailProp,
}: {
  productDetailProp?: ProductDetail;
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isCreateLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.productDetail
  );
  const [form] = useForm<ProductDetailFormState>();
  const productId = location.pathname.split("/").pop();

  useEffect(() => {
    if (productDetailProp) {
      form.setFieldsValue({
        ...productDetailProp,
        images: productDetailProp.images,
        productId: productDetailProp.product.id,
      });
    } else {
      form.setFieldsValue({
        productId: productId,
      });
    }
  }, [productDetailProp, productId, form]);

  return (
    <Form
      form={form}
      onFinish={(values) => {
        dispatch(
          values.id
            ? updateProductDetailAction({
                productDetail: values,
                resetForm: () => {
                  form.resetFields();
                  form.setFieldsValue({
                    productId: productId,
                  });
                },
              })
            : createProductDetailAction({
                productDetail: values,
                resetForm: () => {
                  form.resetFields();
                  form.setFieldsValue({
                    productId: productId,
                  });
                },
              })
        );
      }}
      validateMessages={validateMessages}
      layout="vertical"
    >
      <Form.Item name="images" label="Hình ảnh">
        <ImagesSelector
          className="w-[80px] h-[80px]"
          value={form.getFieldValue("images")}
          onOke={(values) =>
            form.setFieldsValue({
              images: values,
            })
          }
        />
      </Form.Item>
      <Form.Item name="productId" hidden noStyle />
      <Form.Item name="id" hidden noStyle />
      <div className="w-full">
        <Form.Item
          name="name"
          label="Tên món ăn chi tiết"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </div>
      <Form.Item name="description" label="Mô tả ">
        <Input.TextArea showCount maxLength={2000} />
      </Form.Item>

      <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
        <InputNumber
          className="w-full"
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
          }
          parser={(value) => value!.replace(/\./g, "")}
        />
      </Form.Item>
      <Form.Item className="mb-0 text-end">
        <Popconfirm title="Bạn có muốn lưu?" onConfirm={form.submit}>
          <Button loading={isCreateLoading || isUpdateLoading} type="primary">
            Lưu
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
