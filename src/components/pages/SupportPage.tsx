import { Button } from "antd";
import {
  PhoneOutlined,
  MessageOutlined,
  MailOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  CarOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { ManagementLayout } from "../templates/ManagementLayout";
import { Link } from "react-router-dom";

export const SupportPage = () => {
  return (
    <ManagementLayout>
      <div className="max-w-7xl mx-auto bg-white rounded-lg">
        <div className="text-2xl font-bold mb-8">Trung tâm hỗ trợ</div>

        {/* Chăm sóc khách hàng */}
        <div className="mb-12">
          <div className="text-lg font-semibold mb-6">Chăm sóc khách hàng</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hotline */}
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <PhoneOutlined className="text-primary text-3xl mb-4" />
              <h3 className="font-medium mb-2">Hotline</h3>
              <div className="text-xl font-bold mb-2">0357702364</div>
              <p className="text-gray-500 text-sm">
                1000 đ/phút, 8h-20h kể cả thứ 7
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <MessageOutlined className="text-primary text-3xl mb-4" />
              <h3 className="font-medium mb-2">Gặp Trợ lý cá nhân</h3>
              <Button type="primary" className="bg-primary mb-2">
                <Link to="https://www.facebook.com/profile.php?id=100085580808149">
                  Chat ngay
                </Link>
              </Button>
              <p className="text-gray-500 text-sm">8h-20h kể cả Thứ 7</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <MailOutlined className="text-primary text-3xl mb-4" />
              <h3 className="font-medium mb-2">Gửi yêu cầu hỗ trợ</h3>
              <Button type="primary" className="bg-primary mb-2">
                Tạo đơn yêu cầu
              </Button>
              <p className="text-gray-500 text-sm">
                Hoặc email đến foodPoni@gmail.com
              </p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-6">Tra cứu thông tin</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <ShoppingCartOutlined className="text-2xl text-gray-600" />
                <div>
                  <h3 className="font-medium mb-2">Đơn hàng và thanh toán</h3>
                  <p className="text-gray-500 mb-3">
                    Cách tra cứu đơn hàng, sử dụng mã giảm giá và các phương
                    thức thanh toán...
                  </p>
                  <Button type="link" className="text-primary p-0">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>

            {/* Tài khoản của tôi */}
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <UserOutlined className="text-2xl text-gray-600" />
                <div>
                  <h3 className="font-medium mb-2">Tài khoản của tôi</h3>
                  <p className="text-gray-500 mb-3">
                    Cách đăng ký tài khoản tại FoodPoni, chỉnh sửa thông tin cá
                    nhân, theo dõi đơn hàng...
                  </p>
                  <Button type="link" className="text-primary p-0">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>

            {/* Đơn hàng và vận chuyển */}
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <CarOutlined className="text-2xl text-gray-600" />
                <div>
                  <h3 className="font-medium mb-2">Đơn hàng và vận chuyển</h3>
                  <p className="text-gray-500 mb-3">
                    Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi
                    trả online ...
                  </p>
                  <Button type="link" className="text-primary p-0">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>

            {/* Đổi trả, bảo hành và hoàn tiền */}
            <div className="border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <SafetyCertificateOutlined className="text-2xl text-gray-600" />
                <div>
                  <h3 className="font-medium mb-2">
                    Đổi trả, bảo hành và hoàn tiền
                  </h3>
                  <p className="text-gray-500 mb-3">
                    Chính sách đổi trả, cách kích hoạt bảo hành, hướng dẫn đổi
                    trả online ...
                  </p>
                  <Button type="link" className="text-primary p-0">
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ManagementLayout>
  );
};
