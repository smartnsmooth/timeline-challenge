import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { KeyframeList } from "./Timeline/KeyframeList"; // Adjust the import based on your file structure
import { Timeline } from "./Timeline/Timeline"; // Adjust the import based on your file structure

describe("KeyframeList Component", () => {
  let onScrollMock: jest.Mock;
  const duration = 2000; // Set the duration for testing

  beforeEach(() => {
    onScrollMock = jest.fn();
    render(
      <KeyframeList
        duration={duration}
        divRef={null}
        onScroll={onScrollMock}
        count={10}
      />
    );
  });

  it("should have the correct width based on duration", () => {
    const keyframeList = screen.getAllByTestId("segment");
    expect(keyframeList[0].style.width).toBe(`${duration}px`); // Check if the width matches the duration
  });
});

describe("Scroll synchronization between Ruler and KeyframeList", () => {
  beforeEach(() => {
    render(<Timeline />);
  });

  it("should synchronize scroll between Ruler and KeyframeList", () => {
    const keyframeList = screen.getByTestId("keyframe-list");
    const ruler = screen.getByTestId("ruler");
    const trackList = screen.getByTestId("track-list");

    Object.defineProperty(keyframeList, "scrollLeft", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(ruler, "scrollLeft", { value: 0, writable: true });
    Object.defineProperty(keyframeList, "scrollTop", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(trackList, "scrollTop", { value: 0, writable: true });

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 100 } });
    expect(ruler.scrollLeft).toBe(100);

    fireEvent.scroll(keyframeList, { target: { scrollTop: 150 } });
    expect(trackList.scrollTop).toBe(150);
  });
});
