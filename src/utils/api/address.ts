import { AddressRequest } from "@/components/organisms/ShippingAddressInfo.tsx";
import { Address, Page, SearchResult } from "@/type/types.ts";
import { accessToken, api, apiWithToken } from "@/utils/axiosConfig.ts";
import { AxiosResponse } from "axios";
import generateQueryString, { QueryParams } from "./common";

export const getAddressesPage = (
  queryParams: QueryParams
): Promise<Page<Address[]>> => {
  return apiWithToken()
    .get(generateQueryString("/addresses", queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Page<Address[]>>) => res.data);
};

export const getAddressById = (
  aid: string,
  queryParams: QueryParams
): Promise<Address> => {
  return apiWithToken()
    .get(generateQueryString(`/addresses/${aid}`, queryParams), {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<Address>) => res.data);
};

export const createAddress = ({
  fullName,
  phoneNumber,
  address,
  lon,
  lat,
}: {
  fullName: string;
  phoneNumber: string;
  address: string;
  lon: number;
  lat: number;
}): Promise<string> => {
  return apiWithToken()
    .post(
      "/addresses",
      { fullName, phoneNumber, address, lon, lat },
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    )
    .then((res: AxiosResponse<string>) => res.data);
};

export const updateAddress = (
  values: AddressRequest
): Promise<{ id: string }> => {
  return apiWithToken()
    .put("/addresses/update-info", values, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<string>) => ({
      id: res.data,
    }));
};

export const deleteAddressById = (aid: string): Promise<void> => {
  return apiWithToken().delete(`/addresses/${aid}`, {
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  });
};

export const searchAddresses = (
  value: string
): Promise<Array<SearchResult>> => {
  return api
    .get(
      `https://nominatim.openstreetmap.org/search?q=${value}&format=json&addressdetails=1&countrycodes=vn`
    )
    .then((res: AxiosResponse<Array<SearchResult>>) => res.data);
};

export const calculateShippingFee = (addressId: string): Promise<number> => {
  return apiWithToken()
    .get(`/shipping-fee/${addressId}`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    })
    .then((res: AxiosResponse<number>) => res.data);
};

export const calculateShippingFee2 = (
  lon: number,
  lat: number
): Promise<number> => {
  return api
    .get(`/shipping-fee?lon=${lon}&lat=${lat}`)
    .then((res: AxiosResponse<number>) => res.data);
};
