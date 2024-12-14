import { updateUserAction } from "@/redux/modules/user";
import { RootState } from "@/redux/store";
import { User } from "@/type/types";
import { Button, Form, Input, Popconfirm, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageSelector } from "./ImageSelector";

export type UserFormState = {
  id: string;
  avatar: string;
  email: string;
  birthday: Date;
  gender: boolean;
  username: string;
};

export const UserForm = ({ user }: { user: User }) => {
  const dispatch = useDispatch();
  const { isUpdateLoading } = useSelector((state: RootState) => state.user);
  const [form] = useForm<UserFormState>();

  useEffect(() => {
    if (user) {
      const formattedBirthday = user.birthday
        ? new Date(user.birthday).toISOString().split("T")[0]
        : "";

      form.setFieldsValue({
        ...user,
        birthday: formattedBirthday,
      });
    }
  }, [user, form]);
  return (
    <Form
      form={form}
      onFinish={(value) => {
        dispatch(
          updateUserAction({
            user: value,
            resetForm: () => form.resetFields(),
          })
        );
      }}
      layout="vertical"
      initialValues={
        user && {
          ...user,
        }
      }
    >
      <div className="flex gap-8">
        <Form.Item name="id" label="ID" hidden={true}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="avatar" label="Ảnh đại diện">
          <ImageSelector
            className="w-[120px] h-[120px]"
            value={form.getFieldValue("avatar")}
            onOke={(value) => form.setFieldsValue({ avatar: value })}
          />
        </Form.Item>
        <div className="w-full">
          <Form.Item
            name="username"
            label="Tên tài khoản"
            rules={[
              { required: true, message: "Vui lòng nhập tên tài khoản!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng nhập ngày sinh" }]}
          >
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
        </div>
      </div>

      <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
        <Select
          allowClear
          placeholder="Please select"
          options={[
            { value: true, label: "Nam" },
            { value: false, label: "Nữ" },
          ]}
        />
      </Form.Item>
      <Form.Item className="mb-0 text-end">
        <Popconfirm title="Are you sure to save?" onConfirm={form.submit}>
          <Button loading={isUpdateLoading} type="primary">
            Lưu
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
