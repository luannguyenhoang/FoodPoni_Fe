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
      <footer className="py-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-x-8 gap-y-12">
            <div className="space-y-6">
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
          </div>
        </div>
      </footer>
      <ChatBot showChatbot={showChatbot} toggleChatbot={toggleChatbot} />
      <CartGroup />
    </div>
  );
}
