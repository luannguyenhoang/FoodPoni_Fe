import { Card, Divider, Typography } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const { Text } = Typography;

export const OrderInfoCard: React.FC = () => {
  const order = useSelector((state: RootState) => state.order.selectedOrder);

  if (!order) return null;

  return (

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-100 p-5 rounded-lg">
      <Card>
        <div>
          <h3 className='font-bold text-primary text-xl'>ĐỊA CHỈ NGƯỜI NHẬN</h3>
          <Divider></Divider>
          <div className="font-bold mb-2">
            <Text>{order.shippingAddress.fullName}</Text>
          </div>
          <div className="mb-2">
            <Text>Địa chỉ: {order.shippingAddress.address}</Text>
          </div>
          <div>
            <Text>Số điện thoại: {order.shippingAddress.phoneNumber}</Text>
          </div>
        </div>
      </Card>
      <Card>
        <div>
          <h3 className='font-bold text-primary text-xl'>HÌNH THỨC GIAO HÀNG</h3>
          <Divider></Divider>
          <div className="mb-2">
            <Text>Giao hàng nhanh</Text>
          </div>
          <div className="mb-2">
            <Text>Giao vào thứ 5, 11/11</Text>
          </div>
          <div className="mb-2">
            <Text>Được giao bởi BATMAN</Text>
          </div>
          <div>
            <Text>Phí vận chuyển: {order.shippingFee}đ</Text>
          </div>
        </div>
      </Card>
      <Card>
        <div>
          <h3 className='font-bold text-primary text-xl'>HÌNH THỨC THANH TOÁN</h3>
          <Divider></Divider>
          <div className="flex items-center">
            <img src="/tien-mat.png" className="w-9 h-9 mr-2" alt="Payment method" />
            <Text>{order.payment.method?.includes('CASH') ? 'Tiền mặt' : 'VNPay'}</Text>
          </div>
        </div>
      </Card>
    </div>

  );
};