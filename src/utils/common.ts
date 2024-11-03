import { server } from "@/utils/server.ts";
import { Cart, User } from "@/type/types.ts";
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
      console.log(editingFields[i].value, savedFields[i].value);
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

export const getThumbnail = (thumbnail: string | null | undefined) => {
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

export const groupByUser = (
  cartItems: CartGroupState["cartGroupJoined"][number]["cartItems"]
) => {
  const userMap = new Map<
    string,
    {
      user: {
        id: string;
        username: string;
        avatar: string;
      };
      kickingUserFromCartItemLoading: boolean;
      items: Cart[];
    }
  >();

  cartItems.forEach((ci) => {
    if (ci.user) {
      const userId = ci.user.id;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
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

export const totalAmount = (
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
