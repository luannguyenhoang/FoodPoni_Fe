import { getThumbnail } from "@/utils/common.ts";
import { Countdown } from "./Countdown";
import { ReactNode } from "react";

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
  fullName?: string;
  avatar?: string | null;
  info: string | ReactNode;
  padding?: string;
  isVisibleCapital?: boolean;
  timeout?: number;
  roomId?: string;
  deleteCartGroup?: () => void;
}) => (
  <div className={`flex items-center gap-4 ${padding}`}>
    <div className="relative">
      <img
        className="min-w-[40px] h-[40px] aspect-square rounded-full object-cover"
        src={getThumbnail(avatar)}
        alt=""
        onError={(e) => {
          e.currentTarget.src = getThumbnail("");
        }}
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
