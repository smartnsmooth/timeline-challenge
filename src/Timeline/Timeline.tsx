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
  const count = 26;

  const rulerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (rulerRef.current && keyframeRef.current) {
      keyframeRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };
  const trackListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (trackListRef.current && keyframeRef.current) {
      keyframeRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };
  const keyframeListScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (rulerRef.current && keyframeRef.current && trackListRef.current) {
      rulerRef.current.scrollLeft = e.currentTarget.scrollLeft;
      trackListRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  return (
    <div
      className="relative h-[300px] w-full grid grid-cols-[300px_1fr] grid-rows-[40px_1fr] 
    bg-gray-800 border-t-2 border-solid border-gray-700"
      data-testid="timeline"
    >
      <PlayControls time={time} setTime={setTime} duration={duration} setDuration={setDuration} />
      <Ruler time={time} setTime={setTime} duration={duration} divRef={rulerRef} onScroll={rulerScroll} />
      <TrackList divRef={trackListRef} onScroll={trackListScroll} count={count} />
      <KeyframeList duration={duration} divRef={keyframeRef} onScroll={keyframeListScroll} count={count} />
      <Playhead time={time} />
    </div>
  );
};
