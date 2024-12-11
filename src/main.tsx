import store from "@/redux/store.ts";
import "../styles/globals.scss";
import { ConfigProvider } from "antd";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { App, SecuredRoute } from "./components/App";
import { AccountInformationPage } from "./components/pages/AccountInformationPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { AdminDashboardPage } from "./components/pages/AdminDashboard.tsx";
import { AdminFileManagementPage } from "./components/pages/AdminFileManagementPage.tsx";
import { HomePage } from "./components/pages/HomePage";
import { LoginPage } from "./components/pages/LoginPage";
import { OrderDetailPage } from "./components/pages/OrderDetailPage";
import { OrderPage } from "./components/pages/OrderPage";
import { ProductCategoryPage } from "./components/pages/ProductCategoryPage";
import { ProductDetailPage } from "./components/pages/ProductDetailPage";
import { SignUpPage } from "./components/pages/SignUpPage.tsx";
import { OrderGroupPage } from "./components/pages/OrderGroupPage";
import { OrderGroupDetailPage } from "./components/pages/OrderGroupDetailPage";
import { OrderPostPaidDetailPage } from "./components/pages/OrderPostPaidDetailPage";
import { AdminOrderTablePage } from "./components/pages/AdminOrderTablePage";
import { AdminProductTablePage } from "./components/pages/AdminProductTablePage";
import { AdminProductDetailTablePage } from "./components/pages/AdminProductDetailTablePage";
import { ConsolidatedInvoicePage } from "./components/pages/ConsolidatedInvoicePage";
import { PostPaidDetailPage } from "./components/pages/PostPaidDetailPage";
import { SupportPage } from "./components/pages/SupportPage";
import { AdminToppingTablePage } from "./components/pages/AdminToppingTablePage";
import { AdminProductCategoriesTablePage } from "./components/pages/AdminProductCategoriesTablePage";
import { AdminRefundTablePage } from "./components/pages/AdminRefundTablePage.tsx";
import { AddressPage } from "./components/pages/AddressPage.tsx";
import { AdminUserTablePage } from "./components/pages/AdminUserTablePage.tsx";
import { AdminPostPaidTablePage } from "./components/pages/AdminPostPaidTablePage.tsx";
import { AdminDetailPostPaidPage } from "./components/pages/AdminDetailPostPaidPage.tsx";

export const router = (currentRole?: "RETAILER" | "CUSTOMER" | "VIP" | null) =>
  createBrowserRouter([
    // Shop routes
    {
      path: "/login",
      element: currentRole ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: "/signup",
      element: currentRole ? <Navigate to="/" /> : <SignUpPage />,
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
      path: "/ho-tro-khach-hang",
      element: <SupportPage />,
    },
    {
      path: "/danh-muc/:pathVariable",
      element: <ProductCategoryPage />,
    },
    {
      path: "/checkout",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <CheckoutPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/don-hang",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/don-hang/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderDetailPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/thong-tin-tai-khoan",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <AccountInformationPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/so-dia-chi",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <AddressPage />
        </SecuredRoute>
      ),
    },

    {
      path: "/don-hang-nhom",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderGroupPage />
        </SecuredRoute>
      ),
    },

    {
      path: "don-hang-nhom/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["CUSTOMER", "VIP"]}>
          <OrderGroupDetailPage />
        </SecuredRoute>
      ),
    },
    {
      path: "/ghi-no",
      element: (
        <SecuredRoute currentRole={currentRole} role={["VIP"]}>
          <ConsolidatedInvoicePage />
        </SecuredRoute>
      ),
    },
    {
      path: "ghi-no/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["VIP"]}>
          <PostPaidDetailPage />
        </SecuredRoute>
      ),
    },
    {
      path: "ghi-no/don-hang/:orderId",
      element: (
        <SecuredRoute currentRole={currentRole} role={["VIP"]}>
          <OrderPostPaidDetailPage />
        </SecuredRoute>
      ),
    },

    // Admin routes
    {
      path: "/admin",
      children: [
        {
          index: true,
          element: <Navigate to="/admin/dashboard" replace />,
        },
        {
          path: "dashboard",
          element: (
            // <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
            <AdminDashboardPage />
            // </SecuredRoute>
          ),
        },
        {
          path: "file-management",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminFileManagementPage />
            </SecuredRoute>
          ),
        },
        {
          path: "orders-realtime",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <div>Orders Realtime</div>
            </SecuredRoute>
          ),
        },
        {
          path: "orders-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminOrderTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "orders-refund-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminRefundTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "orders-postpaid-detail/:orderId",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminDetailPostPaidPage />
            </SecuredRoute>
          ),
        },
        {
          path: "users-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminUserTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "orders-postpaid-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminPostPaidTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "products-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminProductTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "product-details/:pid",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminProductDetailTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "product-categories-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminProductCategoriesTablePage />
            </SecuredRoute>
          ),
        },
        {
          path: "product-toppings-table",
          element: (
            <SecuredRoute currentRole={currentRole} role={["RETAILER"]}>
              <AdminToppingTablePage />
            </SecuredRoute>
          ),
        },
      ],
    },
  ]);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(
    <Provider store={store}>
      <ConfigProvider theme={{ token: { colorPrimary: "#F36F24" } }}>
        <App />
      </ConfigProvider>
    </Provider>
  );
}
