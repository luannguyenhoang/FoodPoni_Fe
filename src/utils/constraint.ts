export const getNotificationOrderMessage = (id: string, type: string) => {
  switch (type) {
    case "PENDING":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} vừa được đặt. Vui lòng kiểm tra và xác nhận.`;
    case "DELIVERING":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đang giao. Vui lòng theo dôi lộ trình đơn hàng.`;
    case "REJECTED":
      return `Chúng tôi nhận thấy đơn hàng #${id.toUpperCase().substring(0, 6)} đáng nghi. Vui lòng kiểm tra lại.`;
    case "APPROVED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã được xác nhận. Hãy theo dõi lộ trình đơn hàng.`;
    case "COMPLETED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã hoàn tất. Hãy gửi lời đánh giá ngay nào.`;
    case "FAILED":
      return `Đơn hàng #${id.toUpperCase().substring(0, 6)} đã bị hủy do gặp sự cố không mong muốn. Rất mong quý khách thông cảm.`;
    default:
      return `Không xác định được nội dung thông báo`;
  }
};

export const getMessage = (key: string) => {
  switch (key.toLowerCase()) {
    // message
    case "a01":
      return "Có vẻ như địa chỉ không tồn tại. Hãy thử lại!";
    case "a02":
      return "Địa chỉ bạn nhập đã có sẵn. Hãy thử một địa chỉ khác hoặc cập nhật thông tin hiện có!";
    case "a03":
      return "Vui lòng cung cấp họ tên. Trường này không được để trống.";
    case "a04":
      return "Vui lòng cung cấp số điện thoại. Trường này không được để trống.";
    case "a05":
      return "Vui lòng cung cấp địa chỉ. Trường này không được để trống.";
    case "a06":
      return "Vui lòng cung cấp họ tên. Trường này không được để trống.";
    case "a07":
      return "Vui lòng cung cấp số điện thoại. Trường này không được để trống.";
    case "a08":
      return "Vui lòng cung cấp địa chỉ. Trường này không được để trống.";
    case "a09":
      return "Vui lòng cung cấp họ tên, số điện thoại và địa chỉ. Các trường này không được để trống.";
    case "a10":
      return "Vui lòng cung cấp họ tên, số điện thoại và địa chỉ. Các trường này không được để trống.";
    case "a11":
      return "Slug bạn cung cấp đã được sử dụng. Hãy thử một slug khác để đảm bảo tính duy nhất.";
    case "a12":
      return "Địa chỉ của bạn cần phải nằm trong khoảng cách 1 km. Vui lòng kiểm tra và nhập lại.";

    case "c01":
      return "Có vẻ như danh mục sản không tồn tại. Hãy thử lại!";
    case "c02":
      return "Vui lòng cung cấp tên danh mục. Trường này không được để trống.";
    case "c03":
      return "Danh mục đã tồn tại trong hệ thống.";

    case "ct01":
      return "Có vẻ như giỏ hàng không tồn tại. Hãy thử lại!";
    case "ct02":
      return "Sản phẩm đã tồn tại trong giỏ hàng.";

    case "cr01":
      return "Số lượng không hợp lệ";

    case "fu01":
      return "Có vẻ như tệp tải lên không tồn tại. Hãy thử lại!";
    case "fu02":
      return "Tệp tải lên đã có sẵn. Hãy thử một tệp khác!";

    case "in01":
      return "Thông báo không hợp lệ.";
    case "in02":
      return "Có vẻ như thông báo không tồn tại. Hãy thử lại!";

    case "o01":
      return "Đơn hàng không hợp lệ. Vui lòng kiểm tra lại thông tin và thử lại.";
    case "o02":
      return "Có vẻ như đơn hàng không tồn tại. Hãy thử lại!";
    case "o03":
      return "Xin lỗi, bạn không thể vừa là khách hàng vừa là người bán trong cùng một giao dịch.";
    case "o04":
      return "Đơn hàng của bạn cần phải được hoàn tất. Vui lòng kiểm tra lại!";
    case "o05":
      return "Đơn hàng đã được hoàn tất.";
    case "o06":
      return "Đơn hàng đã bị hủy.";
    case "o07":
      return "Đơn hàng đã bị từ chối.";
    case "o08":
      return "Trạng thái đơn hàng không hợp lệ. Vui lòng kiểm tra!";

    case "oi01":
      return "Xin lỗi, mặt hàng trong đơn hàng không phải từ cùng một người bán. Vui lòng kiểm tra lại và điều chỉnh đơn hàng của bạn.";
    case "oi02":
      return "Một hoặc nhiều mặt hàng trong đơn hàng của bạn bị trùng lặp. Vui lòng loại bỏ các mặt hàng không cần thiết.";
    case "oi03":
      return "Xin lỗi, đơn hàng của bạn không thể chứa mặt hàng không hợp lệ. Vui lòng kiểm tra lại và loại bỏ các mặt hàng không hợp lệ.";
    case "oi04":
      return "Có vẻ như một mặt hàng bạn đã chọn không tồn tại. Hãy kiểm tra và đảm bảo rằng tất cả các sản phẩm đều có sẵn.";
    case "oi05":
      return "Mặt hàng đã được đánh giá trước đó.";
    case "oi06":
      return "Xin lỗi, người bán không thể mua hàng. Vui lòng sử dụng tài khoản khách hàng để thực hiện đơn hàng.";
    case "oi07":
      return "Đơn hàng không phải là đơn hàng nhóm.";
    case "oi08":
      return "Mặt hàng trong đơn hàng không thể là trống. Vui lòng kiểm tra và điều chỉnh danh sách sản phẩm.";

    case "p01":
      return "Có vẻ như sản phẩm không tồn tại. Hãy thử lại!";
    case "p02":
      return "Sản phẩm đã tồn tại trong hệ thống.";
    case "p03":
      return "Sản phẩm với slug này đã có sẵn. Vui lòng kiểm tra lại và nhập slug khác.";
    case "p04":
      return "Tên và sản phẩm chi tiết không được để trống.";
    case "p05":
      return "Sản phẩm này đã bị khóa và không thể mua. Hãy kiểm tra lại sau hoặc tìm kiếm sản phẩm khác.";
    case "p06":
      return "Slug sản phẩm không được để trống.";
    case "p07":
      return "Không tìm thấy sản phẩm với slug đã cho. Vui lòng kiểm tra.";

    case "pd01":
      return "Có vẻ như sản phẩm chi tiết không tồn tại. Hãy thử lại!";
    case "pd02":
      return "Sản phẩm chi tiết đã tồn tại.";
    case "pd03":
      return "Vui lòng cung cấp sản phẩm chi tiết. Trường này không được để trống.";
    case "pd04":
      return "Tên sản phẩm chi tiết bị trùng lặp.";
    case "pd05":
      return "Sản phẩm chi tiết này đã bị khóa và không thể mua. Hãy kiểm tra lại sau hoặc tìm kiếm sản phẩm chi tiết khác.";

    case "pm01":
      return "Không tìm thấy thông tin thanh toán. Vui lòng kiểm tra lại và thử lại.";

    case "pp01":
      return "Có vẻ như phiếu ghi nợ không tồn tại. Hãy thử lại!";
    case "pp02":
      return "Đơn hàng ghi nợ của bạn từ tháng trước vẫn chưa được thanh toán. Vui lòng kiểm tra và thực hiện thanh toán.";
    case "pp03":
      return "Phiếu ghi nợ đã được thanh toán. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!";
    case "pp04":
      return "Vui lòng thanh toán đơn hàng trả sau";
    case "pp05":
      return "Không thể thanh toán đơn hàng trả sau vì một số đơn hàng chưa được xử lý.";
    case "pp06":
      return "Số tiền trả nợ không hợp lệ.";

    case "r01":
      return "Có vẻ như nhóm không tồn tại. Hãy thử lại!";
    case "r02":
      return "Mật khẩu bạn đã cung cấp không chính xác. Vui lòng nhập mật khẩu khác và thử lại.";
    case "r03":
      return "Thời gian tồn tại của nhóm đã hết hạn. Chúng tôi rất mong được chào đón bạn trong những nhóm mới.";
    case "r04":
      return "Có vẻ như người dùng không có trong nhóm. Hãy chắc chắn rằng họ đã tham gia.";
    case "r05":
      return "Nhóm bạn muốn tham gia đã đầy. Hãy thử tham gia một nhóm khác hoặc quay lại sau nhé!";
    case "r06":
      return "Người dùng này không phải là người tạo nhóm. Nếu bạn cần giúp đỡ, hãy liên hệ với người tạo nhóm.";
    case "r07":
      return "Bạn đã đạt giới hạn tạo nhóm tối đa là 3. Vui lòng kiểm tra và quản lý các nhóm hiện có.";
    case "r08":
      return "Bạn có thể tham gia tối đa 3 nhóm. Vui lòng rời một nhóm để có thể tham gia nhóm khác!";
    case "r09":
      return "Xin lỗi, bạn không thể tự loại mình khỏi nhóm. Nếu bạn cần rời đi, hãy sử dụng chức năng xóa nhóm.";
    case "r10":
      return "Bạn đã có mặt trong nhóm. Hãy tiếp tục mua sắm và khám phá các sản phẩm hấp dẫn!";
    case "r11":
      return "Người tạo phòng không thể rời đi. Nếu bạn cần rời đi, hãy sử dụng chức năng xóa nhóm.";

    case "t01":
      return "Không tìm thấy topping.";

    case "u01":
      return "Không tìm thấy người dùng.";
    case "u02":
      return "Tên người dùng hoặc mật khẩu không khớp.";
    case "u03":
      return "Mật khẩu hiện tại không khớp.";
    case "u04":
      return "Không tìm thấy người dùng có tên người dùng hoặc email hoặc số điện thoại đã cho.";
    case "u05":
      return "Email hoặc số điện thoại đã tồn tại.";
    case "u06":
      return "Người dùng với số điện thoại đã tồn tại.";
    case "u07":
      return "Người dùng với email đã tồn tại.";
    case "u08":
      return "Người dùng với tên người dùng đã tồn tại.";
    case "u09":
      return "Người dùng đã tồn tại.";
    case "u10":
      return "Người dùng không xác minh.";
    case "u11":
      return "Người dùng đã xác minh.";
    case "u12":
      return "OTP không khớp.";
    case "u13":
      return "OTP đã tồn tại.";
    case "u14":
      return "Người dùng bị khóa.";
    case "u15":
      return "Email và tên người dùng không được để trống.";
    case "u16":
      return "Ngày sinh không hợp lệ.";
    case "u17":
      return "Email không hợp lệ.";

    //common
    case "cm02":
      return "Vui lòng đăng nhập để có thể thao tác được chức năng này.";
    case "cm03":
      return "Vui lòng đăng nhập để có thể thao tác được chức năng này.";

    default:
      return "Không xác định";
  }
};
