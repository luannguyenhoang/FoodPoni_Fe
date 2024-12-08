export default function HeadTable() {
  return (
    <div className="grid grid-cols-10 px-5 pt-6">
      <div className="col-span-5">
        <div className="font-sans text-[17px] text-gray-400">Món ăn</div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-400">Đơn giá</div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-400">Số lượng</div>
      </div>
      <div className="col-span-1">
        <div className="font-sans text-[17px] text-gray-400">Giảm giá</div>
      </div>
      <div className="col-span-2 text-right">
        <div className="font-sans text-[17px] text-gray-400">Thành tiền</div>
      </div>
    </div>
  );
}
