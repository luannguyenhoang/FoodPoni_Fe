import { Checkbox, Col, Popconfirm, Row, Spin } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

export const CartHeader = ({
  enableCartGroup,
  enableDeleteAll,
  isAllChecked,
  isDeleteAllLoading,
  isCheckAllLoading,
  isDisableCheckbox,
  updateAllCheckedRequest,
  deleteAllCartRequest,
}: {
  enableCartGroup: boolean;
  enableDeleteAll?: boolean;
  isDeleteAllLoading?: boolean;
  isCheckAllLoading?: boolean;
  isAllChecked?: boolean;
  isDisableCheckbox?: boolean;
  updateAllCheckedRequest?: () => void;
  deleteAllCartRequest?: () => void;
}) => (
  <div className="p-2 bg-white border-[1px] rounded-lg">
    {/* Desktop View */}
    <Row className="hidden md:flex">
      {!enableCartGroup && (
        <Col flex="3%">
          {isCheckAllLoading ? (
            <Spin size="small" />
          ) : (
            <Checkbox
              disabled={isDisableCheckbox}
              checked={isAllChecked}
              onClick={updateAllCheckedRequest}
            />
          )}
        </Col>
      )}
      <Col flex={`${enableCartGroup?"34%":"32%"}`}>Tất cả</Col>
      <Col flex={`${enableCartGroup?"11%":"12%"}`}>Đơn giá</Col>
      <Col flex={`${enableCartGroup?"17%":"16%"}`}>Số lượng</Col>
      <Col flex={`${enableCartGroup?"14%":"14%"}`}>Thành tiền</Col>
      <Col flex={`${enableCartGroup?"10%":"18%"}`}>Ghi chú</Col>
      <Col flex={`${enableCartGroup?"3%":"5%"}`} className="text-center">
        {!enableCartGroup && enableDeleteAll && (
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa không?"
            onConfirm={deleteAllCartRequest}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            {isDeleteAllLoading ? (
              <Spin size="small" />
            ) : (
              <DeleteOutlined className="cursor-pointer" />
            )}
          </Popconfirm>
        )}
      </Col>
    </Row>

    {/* Mobile View */}
    <div className="flex md:hidden justify-between items-center">
      <div className="flex items-center gap-2">
        {!enableCartGroup && (
          <Checkbox
            disabled={isDisableCheckbox}
            checked={isAllChecked}
            onClick={updateAllCheckedRequest}
          />
        )}
        <span>Tất cả</span>
      </div>
      {!enableCartGroup && enableDeleteAll && (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa không?"
          onConfirm={deleteAllCartRequest}
          okText="Đồng ý"
          cancelText="Hủy"
        >
          {isDeleteAllLoading ? (
            <Spin size="small" />
          ) : (
            <DeleteOutlined className="cursor-pointer" />
          )}
        </Popconfirm>
      )}
    </div>
  </div>
);
