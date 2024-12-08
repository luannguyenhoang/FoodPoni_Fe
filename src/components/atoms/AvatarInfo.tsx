import { getThumbnail } from "@/utils/common.ts";
import { Countdown } from "./Countdown";

export const AvatarInfo = ({
  fullName,
  avatar,
  info,
  padding,
  isVisibleCapital,
  timeout,
  roomId,
  deleteCartGroup,
}: {
  fullName: string;
  avatar?: string | null;
  info: string;
  padding?: string;
  isVisibleCapital?: boolean;
  timeout?: number;
  roomId?: string;
  deleteCartGroup?: () => void;
}) => (
  <div className={`flex items-center gap-4 ${padding}`}>
    <div className="relative">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={getThumbnail(avatar)}
        alt=""
      />
      {isVisibleCapital && (
        <span className="absolute text-xl text-primary -bottom-2 right-0">
          ✪
        </span>
      )}
    </div>
    <div className="font-medium">
      <div>{fullName}</div>
      <div className="text-[12px] text-gray-500">{info}</div>
    </div>
    {timeout && roomId && (
      <Countdown
        roomId={roomId}
        value={timeout}
        deleteCartGroup={deleteCartGroup}
      />
    )}
  </div>
);
