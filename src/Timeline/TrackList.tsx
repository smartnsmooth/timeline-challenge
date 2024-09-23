import { ForwardedRef } from "react";

type TrackListProps = {
  divRef: ForwardedRef<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  count: number;
};

export const TrackList = ({ divRef, onScroll, count }: TrackListProps) => {
  // TODO: implement scroll sync with `KeyframeList`

  return (
    <div
      className="grid grid-flow-row auto-rows-[40px]
      border-r border-solid border-r-gray-700 
      overflow-auto"
      data-testid="track-list"
      ref={divRef}
      onScroll={(e) => onScroll(e)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="p-2">
          <div>Track {String.fromCharCode(65 + index)}</div>
        </div>
      ))}
    </div>
  );
};
