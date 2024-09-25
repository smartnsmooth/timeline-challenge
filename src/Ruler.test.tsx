import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Ruler } from "./Timeline/Ruler"; // Adjust the import based on your file structure
import { Timeline } from "./Timeline/Timeline"; // Adjust the import based on your file structure

describe("Ruler Component", () => {
  let setTimeMock: jest.Mock;
  let onScrollMock: jest.Mock;
  const time = 100;
  const duration = 2000; // Set the duration for testing

  beforeEach(() => {
    setTimeMock = jest.fn();
    onScrollMock = jest.fn();
    render(
      <>
        <Ruler
          time={time}
          setTime={setTimeMock}
          duration={duration}
          divRef={null}
          onScroll={onScrollMock}
        />
      </>
    );
  });

  it("should update time when clicking on the ruler", () => {
    const rulerBar = screen.getByTestId("ruler-bar");

    // Simulate clicking at a specific point on the ruler
    fireEvent.mouseDown(rulerBar, { clientX: 500 });
    expect(setTimeMock).toHaveBeenCalledWith(500); // Ensure setTime was called
  });

  it("should update time when dragging the mouse on the ruler", () => {
    const rulerBar = screen.getByTestId("ruler-bar");

    // Simulate mouse down and move
    fireEvent.mouseDown(rulerBar, { clientX: 500 });
    fireEvent.mouseMove(document, { clientX: 1000 });
    expect(setTimeMock).toHaveBeenCalledWith(1000); // Check that setTime is called with updated time

    // Simulate moving the mouse to a different position
    fireEvent.mouseMove(document, { clientX: 1500 });
    expect(setTimeMock).toHaveBeenCalledWith(1500); // Check that setTime is called again with updated time
  });

  it("should not exceed the duration", () => {
    const rulerBar = screen.getByTestId("ruler-bar");

    // Simulate mouse down beyond the duration limit
    fireEvent.mouseDown(rulerBar, { clientX: 2500 }); // Assuming the duration is 2000
    expect(setTimeMock).toHaveBeenCalledWith(duration); // Should set to the maximum duration
  });

  it("should not go below 0", () => {
    const rulerBar = screen.getByTestId("ruler-bar");

    // Simulate mouse down before the start
    fireEvent.mouseDown(rulerBar, { clientX: -100 }); // Simulate an invalid position
    expect(setTimeMock).toHaveBeenCalledWith(0); // Should set to the minimum time (0)
  });

  it("should have the correct width based on duration", () => {
    const rulerBar = screen.getByTestId("ruler-bar");
    expect(rulerBar.style.width).toBe(`${duration}px`); // Check if the width matches the duration
  });
});

describe("Scroll synchronization between Ruler and KeyframeList", () => {
  beforeEach(() => {
    // Render the Timeline component, which includes Ruler and KeyframeList
    render(<Timeline />);
  });

  it("should synchronize scroll between Ruler and KeyframeList", () => {
    const keyframeList = screen.getByTestId("keyframe-list");
    const ruler = screen.getByTestId("ruler");
    const trackList = screen.getByTestId("track-list");

    // Set up mock scroll position for both elements
    Object.defineProperty(keyframeList, "scrollLeft", {
      value: 0,
      writable: true,
    });
    Object.defineProperty(ruler, "scrollLeft", { value: 0, writable: true });

    // Simulate scrolling on the KeyframeList (scrollLeft)
    fireEvent.scroll(keyframeList, { target: { scrollLeft: 100 } });

    // Check if the Ruler's scrollLeft has been updated to match the KeyframeList's scrollLeft
    expect(ruler.scrollLeft).toBe(100);

    // Simulate scrolling on the KeyframeList (scrollTop)
    fireEvent.scroll(keyframeList, { target: { scrollTop: 150 } });

    // Check if the Ruler's scrollTop has been updated to match the KeyframeList's scrollTop
    expect(trackList.scrollTop).toBe(150);
  });
});
