import { useState, useRef } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000); // Set a default duration
  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);

  const syncScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (rulerRef.current && keyframeRef.current && trackListRef.current) {
      const scrollLeft = e.currentTarget.scrollLeft;
      const scrollTop = e.currentTarget.scrollTop;
      keyframeRef.current.scrollLeft = scrollLeft;
      rulerRef.current.scrollLeft = scrollLeft;
      trackListRef.current.scrollLeft = scrollLeft;
      keyframeRef.current.scrollTop = scrollTop;
      rulerRef.current.scrollTop = scrollTop;
      trackListRef.current.scrollTop = scrollTop;
    }
  };

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls time={time} setTime={setTime} duration={duration} setDuration={setDuration} />
      <Ruler time={time} setTime={setTime} duration={duration} divRef={rulerRef} onScroll={syncScroll} />
      <TrackList divRef={trackListRef} onScroll={syncScroll} />
      <KeyframeList divRef={keyframeRef} onScroll={syncScroll} />
      <Playhead time={time} />
    </div>
  );
};
