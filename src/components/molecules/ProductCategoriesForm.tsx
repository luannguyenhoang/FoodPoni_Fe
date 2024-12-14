import {
  createProductCategoryAction,
  fetchFormDataAction,
  updateProductCategoryAction,
} from "@/redux/modules/productCategory";
import { RootState } from "@/redux/store";
import { ProductCategory } from "@/type/types";
import { checkProductCategoriesSlugIsExisted } from "@/utils/api/productCategory";
import { toSlug } from "@/utils/common";
import { Button, Form, Input, Popconfirm, Select, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageSelector } from "./ImageSelector";

const validateMessages = {
  required: "${label} is required!",
  types: {
    slug: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export type ProductCategoriesFormState = {
  id: string;
  name: string;
  slug: string;
  description: string;
  thumbnail: string;
  level: number;
  parentProductCategory: ProductCategory | null;
};

let timeout: NodeJS.Timeout | null = null;
export const ProductCategoriesForm = ({
  productCategorie,
}: {
  productCategorie?: ProductCategory;
}) => {
  const dispatch = useDispatch();
  const { formData, isFormLoading } = useSelector(
    (state: RootState) => state.productCategory
  );

  const [error, setError] = useState<boolean | null>(true);

  useEffect(() => {
    dispatch(fetchFormDataAction());
  }, [dispatch]);

  const [form] = useForm<ProductCategoriesFormState>();

  const { isCreateLoading, isUpdateLoading } = useSelector(
    (state: RootState) => state.productCategory
  );

  return (
    <Form
      form={form}
      onFinish={(value) => {
        dispatch(
          value.id
            ? updateProductCategoryAction({
                productCategory: value,
                resetForm: () => form.resetFields(),
              })
            : createProductCategoryAction({
                productCategory: value,
                resetForm: () => form.resetFields(),
              })
        );
      }}
      validateMessages={validateMessages}
      layout="vertical"
      initialValues={
        productCategorie && {
          ...productCategorie,
          parentProductCategory:
            productCategorie.parentProductCategory?.id || null,
          level: productCategorie.level || 0,
        }
      }
    >
      <div className="flex gap-8">
        <Form.Item name="id" label="ID" hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="thumbnail" label="Ảnh">
          <ImageSelector
            className="w-[120px] h-[120px]"
            value={form.getFieldValue("thumbnail")}
            onOke={(value) => form.setFieldsValue({ thumbnail: value })}
          />
        </Form.Item>
        <div className="w-full">
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true }]}
          >
            <Input
              onChange={(e) => {
                form.setFieldsValue({
                  slug: toSlug(e.target.value),
                });
                form.validateFields();
              }}
            />
          </Form.Item>
          <Form.Item
            name="slug"
            label="Slug"
            hasFeedback
            validateStatus={
              error === null ? "validating" : error ? "error" : "success"
            }
            rules={[
              { required: true },
              () => ({
                async validator(_, value) {
                  if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                  }

                  if (value && (error || error === null)) {
                    await new Promise((resolve) => {
                      timeout = setTimeout(() => resolve(0), 500);
                    });

                    setError(null);
                    try {
                      const res = await checkProductCategoriesSlugIsExisted({
                        slug: value,
                        pid: form.getFieldValue("id"),
                      });
                      if (res) {
                        setError(true);
                        return Promise.reject("Slug is existed");
                      } else {
                        setError(false);
                      }
                    } catch (e) {
                      setError(true);
                      return Promise.reject(e.message);
                    }
                  } else {
                    setError(true);
                  }
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
        </div>
      </div>
      <Form.Item name="description" label="Mô tả">
        <Input.TextArea />
      </Form.Item>

      <Form.Item name="parentProductCategory" label="Danh mục gốc">
        {isFormLoading ? (
          <Spin />
        ) : (
          <Select
            allowClear
            placeholder="Chọn danh mục gốc"
            loading={isFormLoading}
            options={formData
              .filter((item) => item.level === 0)
              .map((item) => ({
                value: item.id,
                label: item.name,
              }))}
          />
        )}
      </Form.Item>

      <Form.Item name="level" label="Level" hidden={true}>
        <Input disabled />
      </Form.Item>

      <Form.Item className="mb-0 text-end">
        <Popconfirm title="Are you sure to save?" onConfirm={form.submit}>
          <Button loading={isCreateLoading || isUpdateLoading} type="primary">
            Lưu
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
