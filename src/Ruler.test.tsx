import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Ruler } from "./Timeline/Ruler"; // Adjust the import based on your file structure

describe("Ruler Component", () => {
  let setTimeMock: jest.Mock;
  const time = 100;
  const duration = 2000; // Set the duration for testing

  beforeEach(() => {
    setTimeMock = jest.fn();
    render(<Ruler time={time} setTime={setTimeMock} duration={duration} />);
  });

  it("should update time when clicking on the ruler", () => {
    const rulerBar = screen.getByTestId("ruler-bar");
    
    // Simulate clicking at the middle of the ruler
    fireEvent.mouseDown(rulerBar, { clientX: 500 }); // Adjust the x-coordinate as needed
    expect(setTimeMock).toHaveBeenCalledWith(500); // Verify the time set is correct (assuming 500 is valid)
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
});
