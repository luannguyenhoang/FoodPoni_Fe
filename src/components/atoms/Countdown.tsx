import { useEffect, useState } from "react";

const endTimes: Map<string, number> = new Map();

export const Countdown = ({
  value,
  roomId,
  deleteCartGroup,
}: {
  value: number;
  roomId: string;
  deleteCartGroup?: () => void;
}) => {
  const [timeLeft, setTimeLeft] = useState(value);

  useEffect(() => {
    if (!endTimes.get(roomId))
      endTimes.set(roomId, new Date().getTime() + value); // Tính thời điểm kết thúc

    const intervalId = setInterval(() => {
      const endTime = endTimes.get(roomId);
      if (endTime) {
        const now = new Date().getTime(); // Thời điểm hiện tại
        const remainingTime = endTime - now; // Thời gian còn lại

        if (remainingTime <= 0) {
          deleteCartGroup && deleteCartGroup();
          clearInterval(intervalId);
          setTimeLeft(0); // Đặt timeLeft về 0 khi hết thời gian
        } else {
          setTimeLeft(remainingTime); // Cập nhật thời gian còn lại
        }
      }
    }, 1000);

    // Dọn dẹp interval khi component unmount
    return () => clearInterval(intervalId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h1 className="text-black">
        {formatTime(value, timeLeft, endTimes.get(roomId))}
      </h1>
    </div>
  );
};

const formatTime = (
  value: number,
  timeLeft: number,
  endTime?: number | null
): string => {
  let remainingTime: number;

  if (value === timeLeft && endTime) {
    remainingTime =
      endTime - new Date().getTime() <= 0 ? 0 : endTime - new Date().getTime();
  } else {
    remainingTime = timeLeft;
  }

  const seconds = Math.floor((remainingTime / 1000) % 60);
  const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
  const hours = Math.floor((remainingTime / 1000 / 3600) % 24);

  const humanized = [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");

  return humanized;
};
