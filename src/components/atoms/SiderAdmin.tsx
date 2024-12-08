import {
  DashboardOutlined,
  FileOutlined,
  FundProjectionScreenOutlined,
  RetweetOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  ShoppingOutlined,
  TableOutlined,
  TeamOutlined
} from "@ant-design/icons";
import { Menu } from "antd";
import Sider, { SiderTheme } from "antd/es/layout/Sider";
import { ItemType, MenuItemType } from "antd/es/menu/interface";
import { Link, useLocation } from "react-router-dom";

export const SiderAdmin = ({ theme }: { theme: SiderTheme }) => {
  const location = useLocation();
  return (
    <Sider theme={theme} width={235}>
      <div
        onClick={() => (window.location.href = "/")}
        className="flex items-center gap-1 nunito p-2 text-orange-400 cursor-pointer hover:text-orange-500"
      >
        <img
          src="/logo-02.png"
          className="w-10 h-10 md:w-14 md:h-14"
          alt="FoodPoni Logo"
        />
        <div className="text-2xl">FoodPoni</div>
      </div>
      <Menu
        theme={theme}
        mode="inline"
        defaultSelectedKeys={[location.pathname]}
        items={items}
        defaultOpenKeys={
          location.pathname.includes("/admin/product")
            ? ["/admin/product"]
            : location.pathname.includes("/admin/order")
              ? ["/admin/order"]
              : location.pathname.includes("/admin/order")
                ? ["/admin/refund"]
                : location.pathname.includes("/admin/user")
                  ? ["/admin/user"]
                  : []
        }
      />
    </Sider>
  );
};

const items: ItemType<MenuItemType>[] = [
  {
    key: "/admin/dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/admin/dashboard">Dashboard</Link>,
  },
  {
    key: "/admin/file-management",
    icon: <FileOutlined />,
    label: <Link to="/admin/file-management">File Management</Link>,
  },
  {
    key: "/admin/order",
    icon: <ShoppingCartOutlined />,
    label: "Order Management",
    children: [
      {
        key: "/admin/orders-realtime",
        icon: <FundProjectionScreenOutlined />,
        label: <Link to="/admin/orders-realtime">Orders Realtime</Link>,
      },
      {
        key: "/admin/orders-table",
        icon: <ShoppingOutlined />,
        label: <Link to="/admin/orders-table">Orders</Link>,
      },
      {
        key: "/admin/refund",
        icon: <RetweetOutlined />,
        label: <Link to="/admin/refund">Refund</Link>,
      },
    ],
  },
  {
    key: "/admin/product",
    icon: <ShopOutlined />,
    label: "Product Management",
    children: [
      {
        key: "/admin/products-table",
        icon: <TableOutlined />,
        label: <Link to="/admin/products-table">Products</Link>,
      },
      {
        key: "/admin/product-categories-table",
        icon: <TableOutlined />,
        label: (
          <Link to="/admin/product-categories-table">Product Categories</Link>
        ),
      },
      {
        key: "/admin/product-toppings-table",
        icon: <TableOutlined />,
        label: <Link to="/admin/toppings-table">Toppings</Link>,
      },
    ],
  },
  {
    key: "/admin/user",
    icon: <TeamOutlined />,
    label: <Link to="/admin/users-table">Danh sách khách hàng</Link>,
  },

];
