import CatBackground from "@/components/atoms/Pet";
import { CartGroup } from "@/components/organisms/CartGroup";
import ChatBot from "@/components/organisms/ChatBot";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const [showChatbot, setShowChatbot] = useState(false);

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };
  return (
    <div className="bg-[#f5f5fa] w-full">
      <CatBackground />
      <footer className="py-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            <div className="lg:max-w-xs space-y-6">
              <Link to="/">
                <div className="font-['Impact','fantasy'] text-4xl text-orange-500 cursor-pointer hover:text-orange-600 transition-colors">
                  FoodPoni
                </div>
              </Link>
              <p className="text-gray-300 text-sm leading-relaxed pr-4">
                Chúng tôi cung cấp các món ăn ngon nhất, hãy liên hệ với chúng tôi để đặt hàng:
              </p>
              <div className="flex justify-between text-gray-500">
                <div className="col-info">
                  <div className="in-col">
                    SỐ ĐIỆN THOẠI <br />
                    <span>+1 (800) 060-07-30</span>
                  </div>
                  <div className="in-col">
                    ĐỊA CHỈ CỦA CHÚNG TÔI <br />
                    <span>
                    13 phố Trịnh Văn Bô, phường Phương Canh, quận Nam Từ Liêm, TP Hà Nội
                      <br />
                      10021 USA
                    </span>
                  </div>
                </div>
                <div className="col-info">
                  <div className="in-col">
                    ĐỊA CHỈ EMAIL <br />
                    <span>FoodPoni@gmail.com</span>
                  </div>

                  <div className="in-col">
                    GIỜ LÀM VIỆC <br />
                    <span>Thứ 2 - Thứ 7 7:00pm - 20:00pm</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:pl-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 uppercase">Thông Tin</h3>
              <div className="space-y-3">
                {['về chúng tôi', 'thông tin giao hàng', 'chính sách bảo mật', 'thương hiệu', 'liên hệ', 'trả hàng', 'sơ đồ trang web'].map((item) => (
                  <div key={item} className="text-gray-400 hover:text-orange-500 cursor-pointer transition-colors text-sm capitalize">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-200 uppercase">Tài Khoản Của Tôi</h3>
              <div className="space-y-3">
                {['vị trí cửa hàng', 'lịch sử đơn hàng', 'danh sách yêu thích', 'bản tin', 'ưu đãi đặc biệt', 'phiếu quà tặng', 'đối tác'].map((item) => (
                  <div key={item} className="text-gray-400 hover:text-orange-500 cursor-pointer transition-colors text-sm capitalize">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="col text-gray-400">
              <div className="in-col">bản tin</div>
              <div className="in-col">
                nhập địa chỉ email của bạn bên dưới để đăng ký nhận bản tin của chúng tôi
                <br />
                và cập nhật các chương trình giảm giá và ưu đãi đặc biệt.
              </div>
              <div className="email my-2 rounded-lg flex justify-center">
                <input
                  className="border border-gray-300 rounded-lg p-2"
                  type="email"
                  placeholder="user@example.com"
                />
                <button className="bg-orange-500 text-white px-4 py-2 !rounded-lg">
                  Đăng Ký
                </button>
              </div>

              <div className="in-col">theo dõi chúng tôi trên các mạng xã hội:</div>
              <div className="flex size-9 gap-2 justify-center w-full mb-2">
                <img
                  src="https://i.postimg.cc/44pPB9wk/facebook.png"
                  alt=""
                />
                <img src="https://i.postimg.cc/L8Q3nB4f/twitter.png" alt="" />
                <img src="https://i.postimg.cc/TYG9S3Hy/instagram.png" alt="" />
                <img src="https://i.postimg.cc/kGCxkTwr/youtube.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div className="content-foot">
          <div className="container">
            <div className="foot-text">
              <div className="in-col">SỐ ĐIỆN THOẠI
                powered by <span>tech</span> - designed by <span>hema</span>
              </div>
              <div className="pay">
                <img
                  src="https://i.postimg.cc/PrtWyFPY/visa-logo-png-2013.png"
                  alt=""
                />
                <img
                  src="https://i.postimg.cc/R0j1TSHZ/mastercard-PNG23.png"
                  alt=""
                />
                <img
                  src="https://i.postimg.cc/sggJj0zs/paypal-logo-png-2119.png"
                  alt=""
                />
                <img
                  src="https://i.postimg.cc/hjdsFzBm/American-Express-logo-PNG14.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ChatBot showChatbot={showChatbot} toggleChatbot={toggleChatbot} />
      <CartGroup />
    </div>
  );
}