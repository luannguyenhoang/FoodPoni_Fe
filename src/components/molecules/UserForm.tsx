import { updateUserAction } from "@/redux/modules/user";
import { RootState } from "@/redux/store";
import { User } from "@/type/types";
import { Button, DatePicker, Form, Input, Popconfirm, Radio } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageSelector } from "./ImageSelector";

export type UserFormState = {
  id: string;
  avatar: string;
  email: string;
  birthday: dayjs.Dayjs | null;
  gender: boolean;
};

export const UserForm = ({ user }: { user: User }) => {
  const dispatch = useDispatch();
  const { isUpdateLoading } = useSelector((state: RootState) => state.user);
  const [form] = useForm<UserFormState>();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        birthday: user.birthday ? dayjs(user.birthday) : null,
      });
    }
  }, [user, form]);

  return (
    <Form
      form={form}
      onFinish={(value) => {
        const formattedValue = {
          ...value,
          birthday: value.birthday ? dayjs(value.birthday) : null,
        };
        dispatch(
          updateUserAction({
            user: formattedValue,
            resetForm: () => form.resetFields(),
          })
        );
      }}
      layout="vertical"
      initialValues={
        user && {
          ...user,
          birthday: user.birthday ? dayjs(user.birthday) : null,
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
          <Form.Item name="username" label="Tên tài khoản">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="birthday"
            label="Ngày sinh"
            rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}
          >
            <DatePicker
              value={
                form.getFieldValue("birthday")
                  ? dayjs(form.getFieldValue("birthday"))
                  : null
              }
              className="w-full"
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="Giới tính"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value={true}>Nam</Radio>
              <Radio value={false}>Nữ</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
      </div>

      <Form.Item className="mb-0 text-end">
        <Popconfirm title="Bạn có chắc chắn muốn lưu?" onConfirm={form.submit}>
          <Button loading={isUpdateLoading} type="primary">
            Lưu
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
