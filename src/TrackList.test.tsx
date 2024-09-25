import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Timeline } from "./Timeline/Timeline"; // Adjust the import based on your file structure

describe("Scroll synchronization between TrackList and KeyframeList", () => {
  beforeEach(() => {
    render(<Timeline />);
  });

  it("should synchronize scroll between Ruler and KeyframeList", () => {
    const keyframeList = screen.getByTestId("keyframe-list");
    const trackList = screen.getByTestId("track-list");

    Object.defineProperty(keyframeList, "scrollTop", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(trackList, "scrollTop", { value: 0, writable: true });

    fireEvent.scroll(trackList, { target: { scrollTop: 100 } });
    expect(keyframeList.scrollTop).toBe(100);
  });
});
