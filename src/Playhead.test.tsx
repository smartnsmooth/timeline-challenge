import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { Timeline } from "./Timeline";
import { Playhead } from "./Timeline/Playhead";

describe("Playhead position and visibility", () => {
  let timeInput: HTMLElement;
  let durationInput: HTMLElement;
  let keyframeList: HTMLElement;
  let playhead: HTMLElement;

  beforeEach(() => {
    render(<Timeline />);
    timeInput = screen.getByTestId("current-time-input");
    durationInput = screen.getByTestId("duration-input");
    keyframeList = screen.getByTestId("keyframe-list");
    playhead = screen.getByTestId("playhead");

    // Mock getBoundingClientRect to set width of KeyframeList to 1000px
    jest.spyOn(keyframeList, "getBoundingClientRect").mockReturnValue({
      width: 1000, // Set the mock width to 1000px
      height: 200,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {},
    });
  });

  it("should move in sync with the Ruler and Keyframe List during horizontal scrolling", async () => {
    // Set duration to a value that does not interfere with the time
    userEvent.clear(durationInput);
    await userEvent.type(durationInput, "5000{enter}"); // Assuming 1000 is a valid duration
    expect(durationInput).toHaveValue(5000);

    // Set time to a value within bounds
    userEvent.clear(timeInput);
    await userEvent.type(timeInput, "100{enter}"); // Assuming 500 is within the bounds
    expect(timeInput).toHaveValue(100);
    expect(playhead).toBeInTheDocument();
    expect(playhead).not.toHaveAttribute("hidden");

    fireEvent.scroll(keyframeList, { target: { scrollLeft: 200 } });
    expect(playhead).toBeInTheDocument();
    expect(playhead).toHaveAttribute("hidden");

    userEvent.clear(timeInput);
    await userEvent.type(timeInput, "1100{enter}"); // Assuming 500 is within the bounds
    expect(playhead).not.toHaveAttribute("hidden");

    userEvent.clear(timeInput);
    await userEvent.type(timeInput, "1300{enter}"); // Assuming 500 is within the bounds
    expect(playhead).toHaveAttribute("hidden");
  });
});

describe("Playhead is visible only when within the Timeline's visible area, using the hidden attribute when completely out of view", () => {
  const position = 100;

  it("should be visible when visible is true", () => {
    render(<Playhead position={position} visible={true} />);

    const playhead = screen.getByTestId("playhead");
    expect(playhead).toBeInTheDocument();
    expect(playhead).not.toHaveAttribute("hidden");
  });

  it("should be hidden when visible is false", () => {
    render(<Playhead position={position} visible={false} />);

    const playhead = screen.getByTestId("playhead");
    expect(playhead).toBeInTheDocument();
    expect(playhead).toHaveAttribute("hidden");
  });
});
