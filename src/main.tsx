import store, { RootState } from "@/redux/store.ts";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { Provider, useDispatch, useSelector } from "react-redux";
import "../styles/globals.scss";
import { HomePage } from "./components/pages/HomePage";
import { LoginPage } from "./components/pages/LoginPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { SignupPage } from "./components/pages/SignupPage";
import { CheckoutPage } from "./components/pages/checkoutPage";
import { OrderPage } from "./components/pages/orderPage";
import { ProductCategoryPage } from "./components/pages/productCategoryPage";
import { fetchUserAction } from "./redux/modules/auth";
import { ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { REFRESH_TOKEN } from "./utils/server";
import jwtDecode from "jwt-decode";
import { ProductLoading } from "./components/atoms/productLoading";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  // {
  //   path: '/forgot-password',
  //   element: <ForgotPasswordPage />,
  // },
  // {
  //   path: '/otp',
  //   element: <OtpPage />,
  // },
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/san-pham/:pathVariable",
    element: <ProductDetailPage />,
  },
  {
    path: "/danh-muc/:pathVariable",
    element: <ProductCategoryPage />,
  },
  {
    path: "/checkout",
    element: <CheckoutPage />,
  },

  // Private routes
  {
    path: "/quan-ly",
    errorElement: <div>error</div>,
    children: [
      {
        path: "don-hang",
        element: <OrderPage />,
      },
      {
        path: "don-hang/:orderId",
        element: <OrderDetailPage />,
      },
    ],
  },
]);

const useDispatchProps = () => {
  const dispatch = useDispatch();

  const getCurentUser = (id: string) => dispatch(fetchUserAction({ uid: id }));

  return { getCurentUser };
};

const useSelectorProps = () => {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  return { currentUser };
};

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { getCurentUser } = useDispatchProps();
  const { currentUser } = useSelectorProps();
  const refresh_token = Cookies.get(REFRESH_TOKEN);

  useEffect(() => {

    if (refresh_token) {
      const payload: {
        readonly role: string;
        readonly id: string;
        readonly avatar: string;
        readonly email: string;
        readonly addressId: string;
        readonly username: string;
      } = jwtDecode(refresh_token);
      getCurentUser(payload.id);
    }
  }, []);

  if (refresh_token && !currentUser) return <ProductLoading />;

  return <>{children}</>;
};


const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: "#F36F24" } }}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ConfigProvider>
    </Provider>
  );
}
