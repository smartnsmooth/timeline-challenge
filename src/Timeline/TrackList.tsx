import { ForwardedRef } from "react";

type TrackListProps = {
  divRef: ForwardedRef<HTMLDivElement>;
  onScroll: (e: React.UIEvent<HTMLDivElement>) => void;
};

export const TrackList = ({ divRef, onScroll }: TrackListProps) => {
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
      <div className="p-2">
        <div>Track A</div>
      </div>
      <div className="p-2">
        <div>Track B</div>
      </div>
      <div className="p-2">
        <div>Track C</div>
      </div>
      <div className="p-2">
        <div>Track D</div>
      </div>
      <div className="p-2">
        <div>Track E</div>
      </div>
      <div className="p-2">
        <div>Track F </div>
      </div>
      <div className="p-2">
        <div>Track G</div>
      </div>
      <div className="p-2">
        <div>Track H</div>
      </div>
      <div className="p-2">
        <div>Track I </div>
      </div>
      <div className="p-2">
        <div>Track J</div>
      </div>
    </div>
  );
};
