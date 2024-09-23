import { ForwardedRef } from "react";
import { Segment } from "./Segment";

type KeyframeProps = {
  divRef: ForwardedRef<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

export const KeyframeList = ({ divRef, onScroll }: KeyframeProps) => {
  // TODO: implement scroll sync with `Ruler` and `TrackList`

  return (
    <div className="px-4 min-w-0 overflow-auto" data-testid="keyframe-list" ref={divRef} onScroll={(e) => onScroll(e)}>
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
      <Segment />
    </div>
  );
};
