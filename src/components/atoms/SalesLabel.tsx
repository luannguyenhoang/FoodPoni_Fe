export const SalesLabel = ({ content, color }: { content: string, color?: string }) => (
    <div className="absolute top-0 right-0">
      <div className="w-16 h-4 absolute top-2 -right-4">
        <div className={`h-full w-full bg-${color ?? "primary"} text-white text-center leading-[15px] font-semibold transform rotate-45`}>
          {content}
        </div>
      </div>
    </div>
  );
  