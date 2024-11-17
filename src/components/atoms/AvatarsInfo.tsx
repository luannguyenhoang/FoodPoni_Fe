import { getThumbnail } from "@/utils/common.ts";
import { Countdown } from "./Countdown";
import { Avatar } from "antd";

export const AvatarsInfo = ({
  fullName,
  avatars = [],
  info,
  padding,
  isVisibleCapital,
  timeout,
  roomId,
  deleteCartGroup,
}: {
  fullName: string;
  avatars?: Array<string>;
  info: string;
  padding?: string;
  isVisibleCapital?: boolean;
  timeout?: number;
  roomId?: string;
  deleteCartGroup?: () => void;
}) => (
  <div className={`flex items-center gap-4 ${padding}`}>
    <div className="relative">
      <Avatar.Group
        max={{
          count: 2,
          style: {
            color: "#f56a00",
            backgroundColor: "#fde3cf",
            cursor: "pointer",
            width: "40px",
            height: "40px",
          },
          popover: { trigger: "click" },
        }}
      >
        {Array.isArray(avatars) && avatars.map((it, index) => (
          <Avatar key={index} size="large" src={getThumbnail(it)} />
        ))}
      </Avatar.Group>
      {isVisibleCapital && (
        <span className="absolute text-xl text-primary -bottom-2 right-0">
          ✪
        </span>
      )}
    </div>
    <div className="font-medium ">
      <div>{fullName}</div>
      <div className="text-sm text-gray-500">{info}</div>
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
