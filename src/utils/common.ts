import { server } from "@/utils/server.ts";
import { Cart, OrderItem, User } from "@/type/types.ts";
import { CartGroupState } from "@/redux/modules/cartGroup.ts";

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const checkDirty = (
  editingFields: Array<{
    readonly field: string;
    readonly value: string;
    readonly errorMessage: string | null;
  }>,
  savedFields: Array<{ field: string; value: string }> | null
): boolean => {
  if (!savedFields) {
    return false;
  }

  if (editingFields.length !== savedFields.length) {
    return false;
  }

  //check value in editingFields is equal to value in savedFields
  for (let i = 0; i < editingFields.length; i++) {
    if (
      !["lon", "lat"].includes(editingFields[i].field) &&
      editingFields[i].value !== savedFields[i].value
    ) {
      return false;
    }
  }

  return true;
};

export const getAvatar = (user: User) => {
  if (user.role === "RETAILER") {
    return "/public/logo-02.png";
  }

  if (user.avatar) {
    return user.avatar.startsWith("http") || user.avatar.startsWith("https")
      ? user.avatar
      : server + user.avatar;
  }
  return "/public/no-avatar.png";
};

export const getThumbnail = (thumbnail?: string | null) => {
  if (thumbnail) {
    return thumbnail.startsWith("http") || thumbnail.startsWith("https")
      ? thumbnail
      : server + thumbnail;
  }
  return "/public/no-avatar.png";
};

export const currencyFormat = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const groupCartByUser = (
  cartItems: CartGroupState["cartGroupsJoined"][number]["cartItems"]
) => {
  const userMap = new Map<
    string,
    {
      user: {
        id: string;
        username: string;
        avatar: string;
      };
      kickingUserFromCartItemLoading?: boolean;
      items: Cart[];
    }
  >();

  cartItems.forEach((ci) => {
    if (ci.user) {
      const userId = ci.user.id;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          ...ci,
          user: {
            ...ci.user,
          },
          kickingUserFromCartItemLoading: ci.kickingUserFromCartItemLoading,
          items: [],
        });
      }
      userMap.get(userId)?.items.push(ci);
    }
  });

  return Array.from(userMap.values());
};

export const calculateTotalAmount = (
  content: Array<Cart>,
  skipCheck?: boolean
): number => {
  const getItemTotal = (item: Cart): number => {
    const toppingTotal = item.toppings.reduce((sum, tp) => sum + tp.price, 0);
    return (item.productDetail.price + toppingTotal) * item.quantity;
  };

  return content
    .filter((it) => skipCheck || it.checked)
    .reduce((total, it) => total + getItemTotal(it), 0);
};

export const toSlug = (str: string) => {
  // Chuyển hết sang chữ thường
  str = str.toLowerCase();

  // xóa dấu
  str = str
    .normalize("NFD") // chuyển chuỗi sang unicode tổ hợp
    .replace(/[\u0300-\u036f]/g, ""); // xóa các ký tự dấu sau khi tách tổ hợp

  // Thay ký tự đĐ
  str = str.replace(/[đĐ]/g, "d");

  // Xóa ký tự đặc biệt
  str = str.replace(/([^0-9a-z-\s])/g, "");

  // Xóa khoảng trắng thay bằng ký tự -
  str = str.replace(/(\s+)/g, "-");

  // Xóa ký tự - liên tiếp
  str = str.replace(/-+/g, "-");

  // xóa phần dư - ở đầu & cuối
  str = str.replace(/^-+|-+$/g, "");

  // return
  return str;
};

export const groupOrderByUser = (orderItems: OrderItem[]) => {
  const userMap = new Map<
    string,
    {
      user: { id: string; username: string; avatar: string };
      items: OrderItem[];
    }
  >();

  orderItems.forEach((item) => {
    if (item.user) {
      const userId = item.user.id;
      if (!userMap.has(userId)) {
        userMap.set(userId, { user: item.user, items: [] });
      }
      userMap.get(userId)?.items.push(item);
    }
  });

  return Array.from(userMap.values());
};

export const ORDER_STATUSES = [
  { label: "Chờ xác nhận", key: "PENDING" },
  { label: "Từ chối", key: "REJECTED" },
  { label: "Đang chế biến", key: "APPROVED" },
  { label: "Đang giao", key: "DELIVERING" },
  { label: "Đã nhận hàng", key: "COMPLETED" },
  { label: "Đã hủy", key: "CANCELLED" },
  { label: "Gặp sự cố", key: "FAILED" },
];
export const POSTPAID_STATUSES = [
  { label: "Đã thanh toán", key: "PAID" },
  { label: "Chưa thanh toán", key: "PAYING" },
  { label: "Thanh toán thất bại", key: "FAILED" },
];
