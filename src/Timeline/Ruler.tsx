import { useCallback, useRef, ForwardedRef } from "react";

type RulerProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  divRef: ForwardedRef<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

export const Ruler = ({ setTime, duration, divRef, onScroll }: RulerProps) => {
  const rulerRef = useRef<HTMLDivElement>(null);

  // Update time based on mouse position
  const updateTime = useCallback(
    (clientX: number) => {
      // const ruler = document.querySelector('[data-testid="ruler-bar"]');
      if (rulerRef.current) {
        const { left, width } = rulerRef.current.getBoundingClientRect();
        const newTime =
          Math.round(Math.max(0, Math.min(duration, Math.round(clientX - left))) / 10) * 10 + width - width;
        setTime(newTime);
      }
    },
    [duration, setTime]
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateTime(e.clientX);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    updateTime(e.clientX);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="px-4 py-2 min-w-0 
      border-b border-solid border-gray-700 
      overflow-x-auto overflow-y-hidden"
      data-testid="ruler"
      ref={divRef}
      onScroll={(e) => onScroll(e)}
    >
      <div
        className="w-[2000px] h-6 rounded-md bg-white/25"
        data-testid="ruler-bar"
        ref={rulerRef}
        onMouseDown={handleMouseDown}
      ></div>
    </div>
  );
};
