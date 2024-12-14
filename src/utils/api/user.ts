import { UserFormState } from "@/components/molecules/UserForm";
import { Page, User } from "@/type/types.ts";
import generateQueryString, { QueryParams } from "@/utils/api/common.ts";
import { accessToken, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";

export const getUserPage = (
  queryParams: QueryParams
): Promise<Page<User[]>> => {
  return apiWithToken()
    .get(generateQueryString("/admin/users", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<User[]>>) => res.data);
};

export const updateUser = (user: UserFormState): Promise<void> => {
  return apiWithToken()
    .put(`/users/update-info`, user, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateAvatarUser = (avatar: string): Promise<void> => {
  return apiWithToken()
    .patch(`/users/update-avatar`, avatar, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const getUserById = (uid: string): Promise<User> => {
  return apiWithToken()
    .get(`/users/${uid}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<User>) => res.data);
};

export const updateRole = (
  id: string,
  role: "VIP" | "CUSTOMER"
): Promise<void> => {
  return apiWithToken().patch(
    "/retailer/users/update-role",
    { id, role },
    {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }
  );
};
