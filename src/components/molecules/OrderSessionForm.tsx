import {
  calculateShippingFee2Action,
  startSearchAddressAction,
} from "@/redux/modules/address";
import { createOrderSessionAction } from "@/redux/modules/orderSession";
import { RootState } from "@/redux/store";
import { SearchResult } from "@/type/types";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Popconfirm,
  Spin,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export type OrderSessionRequest = {
  fullName: string;
  phoneNumber: string;
  address: string;
  lon: number;
  lat: number;
  note: string;
};

export const OrderSessionForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addressesSearched, isSearchLoading } = useSelector(
    (state: RootState) => state.address
  );
  const { cartSessions } = useSelector((state: RootState) => state.cartSession);
  const { isCreateLoading } = useSelector(
    (state: RootState) => state.orderSession
  );

  const [form] = useForm<OrderSessionRequest>();

  return (
    <Form
      form={form}
      className="mt-4"
      onFinish={(values) =>
        dispatch(createOrderSessionAction({ navigate, values }))
      }
    >
      <Form.Item name="id" hidden={true} noStyle />
      {/*Full name*/}
      <Form.Item
        name="fullName"
        rules={[
          { required: true, message: "Vui lòng nhập tên người nhận hàng." },
        ]}
      >
        <Input placeholder="Họ tên" />
      </Form.Item>
      {/*Phone number*/}
      <Form.Item
        name="phoneNumber"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại nhận hàng." },
          {
            pattern: /^0[0-9]{9}$/,
            message: "Số điện thoại không hợp lệ.",
          },
        ]}
      >
        <Input placeholder="Số điện thoại" />
      </Form.Item>
      {/*Address*/}
      <Form.Item
        name="address"
        rules={[
          ({ getFieldValue }) => ({
            validator() {
              if (
                getFieldValue("address") &&
                getFieldValue("lon") &&
                getFieldValue("lat")
              ) {
                return Promise.resolve();
              }
              return Promise.reject(
                new Error("Vui lòng chọn địa chỉ nhận hàng.")
              );
            },
          }),
        ]}
      >
        <div className="relative">
          {isSearchLoading && (
            <Spin size="small" className="absolute top-0 right-0 z-50" />
          )}
          <AutoComplete
            showSearch
            options={addressesSearched.map(
              (result: SearchResult, index: number) => ({
                value: result.display_name,
                label: result.display_name,
                data: result,
                key: index,
              })
            )}
            onSelect={(_: string, option: { data: SearchResult }): void => {
              if (option.data.display_name) {
                form.setFieldValue("address", option.data.display_name);
                form.setFieldValue("lon", option.data.lon);
                form.setFieldValue("lat", option.data.lat);

                dispatch(
                  calculateShippingFee2Action({
                    lon: option.data.lon,
                    lat: option.data.lat,
                  })
                );
              }
            }}
            onSearch={(value: string): void => {
              dispatch(startSearchAddressAction({ value }));
            }}
            placeholder="Tìm kiếm địa chỉ tại đây"
            notFoundContent={null}
            style={{ width: "100%" }}
          />
        </div>
      </Form.Item>
      <Form.Item name="lon" hidden={true} noStyle />
      <Form.Item name="lat" hidden={true} noStyle />
      <Form.Item name="note">
        <Input.TextArea placeholder="Ghi chú" />
      </Form.Item>
      <Form.Item className="mb-0">
        <Popconfirm
          title="Bạn có muốn đặt hàng với những thông tin này không?"
          onConfirm={() => form.submit()}
        >
          <Button
            type="primary"
            htmlType="button"
            loading={isCreateLoading}
            disabled={cartSessions.filter((it) => it.checked).length <= 0}
            block
          >
            Đặt hàng
          </Button>
        </Popconfirm>
      </Form.Item>
    </Form>
  );
};
