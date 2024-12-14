import { Button, Card, Checkbox, Form, Input, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { REMEMBER_ME, server } from "@/utils/server.ts";
import Cookies from "js-cookie";
import { clientId, redirectUri, responseType, scopes } from "@/utils/oauth2.ts";
import { Link, useNavigate } from "react-router-dom";
import { RootState } from "@/redux/store.ts";
import { loginAction } from "@/redux/modules/auth.ts";
import { UserRemember } from "@/type/types.ts";
import { useForm } from "antd/es/form/Form";
import { HomeOutlined } from "@ant-design/icons";
import { clearValidate } from "@/redux/modules/message";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoadingGoogle, setLoadingGoogle] = useState(false);
  const { isPending } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearValidate());
    
  }, [dispatch]);

  const rememberMe = useMemo(() => {
    const rememberMeCookie = Cookies.get(REMEMBER_ME);
    if (rememberMeCookie) {
      return JSON.parse(atob(rememberMeCookie)) as UserRemember;
    }
  }, []);

  function handleGoogleLogin() {
    const h: number = 600;
    const w: number = 500;
    const left: number = screen.width / 2 - w / 2;
    const top: number = screen.height / 2 - h / 2;
    setLoadingGoogle(true);
    const googleLoginWindow = window.open(
      "https://accounts.google.com/o/oauth2/v2/auth?&client_id=" +
        clientId +
        "&redirect_uri=" +
        redirectUri +
        "&response_type=" +
        responseType +
        "&scope=" +
        scopes.join("+"),
      "Google LoginWrapper",
      "width=" + w + ",height=" + h + ",top=" + top + ", left=" + left
    );

    const getMessage = (event: MessageEvent<string>) => {
      if (server.startsWith(event.origin)) {
        if (event.data) {
          Cookies.set("refreshToken", event.data, { expires: 7 });
          window.location.href = "/";
        }
        window.removeEventListener("message", getMessage);
        setLoadingGoogle(false);
      }
    };
    window.addEventListener("message", getMessage);
    const checkWindowClosed = setInterval(() => {
      if (googleLoginWindow && googleLoginWindow.closed) {
        setLoadingGoogle(false);
        clearInterval(checkWindowClosed);
      }
    }, 500);
  }

  return (
    <div className='font-medium bg-[url("/logo-bg.jpeg")] bg-cover bg-center bg-no-repeat h-screen flex justify-center  items-center'>
      <Card className="w-[350px] m-auto">
        <Space direction="vertical" size="small" style={{ display: "flex" }}>
          <div className="mb-4 flex flex-col gap-2">
            <div className="flex justify-center items-end font-medium text-xl gap-1">
              <span>Đăng nhập</span>
              <img src="/logo-02.png" className="w-10 h-10" />
              <span className="text-orange-500 font-['Impact','fantasy'] flex">
                FoodPoni
              </span>
            </div>
            <div className="flex justify-center gap-1 font-medium text-gray-500">
              Cần một tài khoản?
              <a className="float-right" onClick={() => navigate("/signup")}>
                Đăng ký ngay
              </a>
            </div>
          </div>
          <Button
            className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 duration-150 active:bg-gray-100"
            size="large"
            onClick={handleGoogleLogin}
            loading={isPending || isLoadingGoogle}
          >
            <img src="/google-icon.svg" className="w-5 h-5" alt="Google Logo" />
            Đăng nhập với Google
          </Button>

          <div className="flex items-center gap-2">
            <span className="border-t border-gray-200 w-full" />
            <span className="text-sm font-medium text-gray-400 uppercase">
              Hoặc
            </span>
            <span className="border-t border-gray-200 w-full" />
          </div>
          <LoginForm
            rememberMe={rememberMe}
            isLoadingGoogle={isLoadingGoogle}
            isPending={isPending}
            onSubmit={(values) => dispatch(loginAction({ values }))}
          />
        </Space>
        <div className="text-center mt-4">
          <HomeOutlined /> <Link to="/">Trở về trang chủ</Link>
        </div>
      </Card>
    </div>
  );
};

export type LoginRequest = {
  readonly username: string;
  readonly password: string;
  readonly remember: boolean;
};

const LoginForm = ({
  rememberMe,
  isLoadingGoogle,
  isPending,
  onSubmit,
}: {
  rememberMe?: UserRemember;
  isLoadingGoogle: boolean;
  isPending: boolean;
  onSubmit: (values: LoginRequest) => void;
}) => {
  const [form] = useForm<LoginRequest>();
  const { validate } = useSelector((state: RootState) => state.message);

  useEffect(() => {
    form.setFields([
      {
        name: "username",
        errors: [validate.username],
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
      initialValues={{ ...rememberMe, remember: true }}
      onFinish={(values) => onSubmit(values)}
    >
      <div className="flex flex-col gap-1 font-medium">Email hoặc username</div>
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập username hoặc email của bạn!",
          },
        ]}
      >
        <Input
          className="!py-2 font-medium"
          placeholder="Email hoặc username"
        />
      </Form.Item>
      <div className="flex font-medium justify-between">
        Mật khẩu
        <a className="login-form-forgot" href="">
          Quên mật khẩu?
        </a>
      </div>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu của bạn!" }]}
      >
        <Input.Password className="!py-2 font-medium" placeholder="Mật khẩu" />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Lưu thông tin đăng nhập</Checkbox>
        </Form.Item>
      </Form.Item>
      <Form.Item className="mb-0">
        <Button
          type="primary"
          htmlType="submit"
          className="!py-5"
          loading={isPending}
          disabled={isPending || isLoadingGoogle}
          block
        >
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};
