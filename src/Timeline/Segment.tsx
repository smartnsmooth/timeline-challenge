type SegmentProps = {
  duration: number;
};

export const Segment = ({ duration }: SegmentProps) => {
  // TODO: resize based on time

  return (
    <div className="w-[2000px] py-2" data-testid="segment">
      <div className="h-6 rounded-md bg-white/10" style={{ width: `${duration}px` }}></div>
    </div>
  );
};
