type Props = {
  w?: string;
  h?: string;
  src: string;
  message: string;
};

export default function EmptyNotice({ w, h, src, message }: Props) {
  return (
    <div className="w-full h-full object-cover flex justify-center">
      <div>
        <div className="flex justify-center">
          <img
            className={`w-${w} h-${h} object-cover`}
            src={src}
            alt="Không có món ăn"
          />
        </div>
        <div className="text-2xl text-center text-gray-500 nunito">
          {message}
        </div>
      </div>
    </div>
  );
}
