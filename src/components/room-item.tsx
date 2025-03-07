import type { Room } from "@/types/room";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Props {
  data: Room;
}

export const RoomItem = ({ data }: Props) => {
  return (
    <div className="flex items-center p-4 gap-2 border rounded-md">
      <Avatar className="size-8">
        <AvatarImage src={data.players?.[data.host]?.image} />
        <AvatarFallback className="text-xs ">
          {data.players?.[data.host]?.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <p className="text-sm flex-1">{data.players?.[data.host]?.name}</p>
      <div className="space-y-1 text-xs ">
        <p className="">グリッドサイズ: {data.config.gridSize}</p>
        <p className="">
          爆弾の表示: {data.config.isVisibleBombs ? "ON" : "OFF"}
        </p>
      </div>
    </div>
  );
};
