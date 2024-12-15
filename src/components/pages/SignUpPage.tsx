import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Input, Popconfirm, Space } from "antd";
import { registerAction } from "@/redux/modules/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "antd/es/form/Form";
import { RootState } from "@/redux/store.ts";
import { useEffect } from "react";
import { clearValidateSuccess } from "@/redux/modules/message";

export const SignUpPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isPending } = useSelector((state: RootState) => state.auth);
  const { validate } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    dispatch(clearValidateSuccess());
  }, [dispatch]);

  return (
    <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex justify-center  items-center'>
      <Card style={{ width: "350px", margin: "auto" }}>
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
          <div className="my-2 flex flex-col gap-2">
            <div className="flex justify-center font-medium text-xl gap-2">
              Đăng ký
              <span className="text-orange-500 font-['Impact','fantasy'] flex">
                <img src="/logo-02.png" className="w-6 h-6" alt="Logo" />
                FoodPoni
              </span>
            </div>
            <div className="flex justify-center gap-1 font-medium text-gray-500">
              Bạn đã có tài khoản?
              <a
                className="float-right cursor-pointer text-blue-500 hover:underline"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </a>
            </div>
          </div>
          <SignUpForm
            isPending={isPending}
            validate={validate}
            onSubmit={(values: SignUpRequest, clearForm: () => void) =>
              dispatch(registerAction({ values, clearForm }))
            }
          />
        </Space>
      </Card>
    </div>
  );
};

export type SignUpRequest = {
  readonly username: string;
  readonly email: string;
  readonly password: boolean;
};

const SignUpForm = ({
  isPending,
  onSubmit,
  validate,
}: {
  isPending: boolean;
  onSubmit: (values: SignUpRequest, clearForm: () => void) => void;
  validate: Record<string, string>;
}) => {
  const [form] = useForm<SignUpRequest>();

  useEffect(() => {
    form.setFields([
      {
        name: "username",
        errors: [validate.username],
      },
      {
        name: "email",
        errors: [validate.email],
      },
      {
        name: "password",
        errors: [validate.password],
      },
    ]);
  }, [validate, form]);

  return (
    <Form
      form={form}
      onFinish={(values) => onSubmit(values, () => form.resetFields())}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Username không được để trống." }]}
      >
        <Input placeholder="Tên đăng nhập" />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: "Email không được để trống." },
          { type: "email", message: "Định dạng email không hợp lệ." },
        ]}
      >
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Mật khẩu không được để trống." }]}
      >
        <Input.Password placeholder="Mật khẩu" />
      </Form.Item>
      <Form.Item className="mb-0">
        <Popconfirm
          title="Bạn đã kiểm tra kỹ thông tin và muốn đăng ký?"
          onConfirm={() => form.submit()}
        >
          <Button type="primary" htmlType="button" loading={isPending} block>
            Đăng ký
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
