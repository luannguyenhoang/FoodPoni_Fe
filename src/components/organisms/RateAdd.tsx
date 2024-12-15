import {
  createRateAction,
  setShowModalAddRate,
  updateRateForm,
} from "@/redux/modules/rate";
import { RootState } from "@/redux/store";
import { Button, Input, Modal, Rate } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { ImagesSelector } from "../molecules/ImagesSelector";

const RateAdd = ({ orderItemId }: { orderItemId: string }) => {
  const dispatch = useDispatch();
  const { showModalAddRate, form, isLoading } = useSelector(
    (state: RootState) => state.rate
  );

  return (
    <Modal
      title="Đánh giá món ăn"
      open={showModalAddRate && form.orderItemId === orderItemId}
      footer={null}
      onCancel={() => {
        dispatch(setShowModalAddRate(false));
        dispatch(updateRateForm({ rate: 0, message: "", images: [], orderItemId: "" }));
      }}
    >
      <div className="p-1">
        <Rate
          value={form.rate}
          onChange={(value: number) => {
            dispatch(updateRateForm({ rate: value }));
          }}
          style={{ fontSize: "50px" }}
        />
        <Input.TextArea
          showCount
          maxLength={100} 
          placeholder="Nhập tin nhắn đánh giá"
          onChange={(e) => {
            dispatch(updateRateForm({ message: e.target.value }));
          }}
          value={form.message}
        />
        <div className="my-3">
          <ImagesSelector
            className="w-[80px] h-[80px]"
            value={form.images}
            onOke={(values) => {
              dispatch(updateRateForm({ images: values }));
            }}
          />
        </div>
        <div className="flex justify-end mt-3">
          <Button
          loading={isLoading}
            disabled={form.rate === 0}
            type="primary"
            onClick={() => {
              dispatch(createRateAction());
            }}
          >
            Gửi đánh giá
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RateAdd;
