export const OrderStatusLabel = ({ status }: { status: string }) => (
  <div className="flex justify-between items-center mb-4">
    <h3>
      {status === "PENDING"
        ? "Chờ xác nhận"
        : status === "APPROVED"
          ? "Đang chế biến"
          : status === "POST_PAID"
            ? "Ghi nợ"
            : status === "DELIVERING"
              ? "Đang giao"
              : status === "REJECTED"
                ? "Bị từ chối"
                : status === "CANCELLED"
                  ? "Đã hủy"
                  : status === "FAILED"
                    ? "Gặp sự cố"
                    : status === "COMPLETED"
                      ? "Đơn hoàn tất"
                      : "Trạng thái không xác định"}
    </h3>
  </div>
);
