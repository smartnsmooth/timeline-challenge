import { useState, useRef, useEffect } from "react";
import { Playhead } from "./Playhead";
import { Ruler } from "./Ruler";
import { TrackList } from "./TrackList";
import { KeyframeList } from "./KeyframeList";
import { PlayControls } from "./PlayControls";

export const Timeline = () => {
  // FIXME: performance concerned
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(2000); // Set a default duration
  const [scrollLeft, setScrollLeft] = useState(0); // Track horizontal scroll
  const [playheadPosition, setPlayheadPosition] = useState(0); // Track horizontal scroll
  const [playheadVisible, setPlayheadVisible] = useState(false); // Track horizontal scroll
  const rulerRef = useRef<HTMLDivElement>(null);
  const keyframeRef = useRef<HTMLDivElement>(null);
  const trackListRef = useRef<HTMLDivElement>(null);
  const count = 26;

  const rulerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (rulerRef.current && keyframeRef.current) {
      keyframeRef.current.scrollLeft = e.currentTarget.scrollLeft;
      setScrollLeft(e.currentTarget.scrollLeft); // Update scroll position
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
      setScrollLeft(e.currentTarget.scrollLeft); // Update scroll position
    }
  };

  useEffect(() => {
    if (keyframeRef.current) {
      const keyframeRect = keyframeRef.current.getBoundingClientRect();
      const playheadPosition = time - scrollLeft; // 1ms = 1px, so directly use time
      setPlayheadPosition(time - scrollLeft);
      // Check if Playhead is within the bounds of KeyframeList
      if (playheadPosition >= 0 && playheadPosition <= keyframeRect.width) {
        setPlayheadVisible(true);
      } else {
        setPlayheadVisible(false);
      }
    }
  }, [time, scrollLeft]); // Depend on time so it re-evaluates on time change

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
      <Playhead position={playheadPosition} visible={playheadVisible} />
    </div>
  );
};
