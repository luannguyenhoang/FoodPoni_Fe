import { Page, Product } from "@/type/types.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";
import { ProductFormState } from "@/components/molecules/ProductForm";

export const getProductsPageByRetailer = (
  rid: string,
  queryParams: QueryParams
): Promise<Page<Product[]>> => {
  return api
    .get(generateQueryString(`/products/retailer/${rid}`, queryParams))
    .then((res: AxiosResponse<Page<Product[]>>) => res.data);
};

export const getProductsPage = (
  queryParams: QueryParams
): Promise<Page<Product[]>> => {
  return api
    .get(generateQueryString("/products", queryParams))
    .then((res: AxiosResponse<Page<Product[]>>) => res.data);
};

export const getProductsPageByCategory = (
  cid: string,
  queryParams: QueryParams
): Promise<Page<Product[]>> => {
  return api
    .get(
      generateQueryString(`/products/product-categories/${cid}`, queryParams)
    )
    .then((res: AxiosResponse<Page<Product[]>>) => res.data);
};

export const getProductByIdOrSlug = (pid: string): Promise<Product> => {
  return api
    .get(`/products/${pid}`)
    .then((res: AxiosResponse<Product>) => res.data);
};

export const checkProductSlugIsExisted = (
  queryParams: QueryParams
): Promise<boolean> => {
  return apiWithToken()
    .get(
      generateQueryString("/retailer/products/is-existed-by-slug", queryParams),
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<boolean>) => res.data);
};

export const createProduct = (product: ProductFormState): Promise<void> => {
  return apiWithToken()
    .post("/retailer/products", product, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateProduct = (product: ProductFormState): Promise<void> => {
  return apiWithToken()
    .put(`/retailer/products/update-info`, product, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const deleteProduct = (pid: string): Promise<void> => {
  return apiWithToken()
    .delete(`/retailer/products/${pid}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<void>) => res.data);
};

export const updateProductStatus = (
  pid: string,
  status: boolean
): Promise<void> => {
  return apiWithToken()
    .patch(
      "/retailer/products/update-status",
      { id: pid, status },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<void>) => res.data);
};

export const searchProductsByRetailer = (
  keyword: string
): Promise<Page<Product[]>> => {
  return apiWithToken()
    .get(`/retailer/products/search?search=${keyword}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Product[]>>) => res.data);
};

export const searchProductsByCustomer = (
  keyword: string
): Promise<Page<Product[]>> => {
  return api
    .get(`/products/search?search=${keyword}`)
    .then((res: AxiosResponse<Page<Product[]>>) => res.data);
};
