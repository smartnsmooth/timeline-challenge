import { ForwardedRef } from "react";
import { Segment } from "./Segment";

type KeyframeProps = {
  duration: number;
  divRef: ForwardedRef<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  count: number;
};

export const KeyframeList = ({ duration, divRef, onScroll, count }: KeyframeProps) => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <div className="px-4 min-w-0 overflow-auto" data-testid="keyframe-list" ref={divRef} onScroll={(e) => onScroll(e)}>
      {Array.from({ length: count }).map((_, index) => (
        <Segment key={index} duration={duration} /> // Pass index or other props as needed
      ))}
    </div>
  );
};
