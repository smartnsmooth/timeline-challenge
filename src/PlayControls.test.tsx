import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { PlayControls } from "./Timeline/PlayControls";

describe("PlayControls Component", () => {
  let setTimeMock: jest.Mock;
  let setDurationMock: jest.Mock;
  const initialTime = 100;
  const initialDuration = 600;
  const minDuration = 100;
  const maxDuration = 6000;

  beforeEach(() => {
    setTimeMock = jest.fn();
    setDurationMock = jest.fn();
    render(
      <PlayControls
        time={initialTime}
        setTime={setTimeMock}
        duration={initialDuration}
        setDuration={setDurationMock}
      />
    );
  });

  describe("Number Input Field", () => {
    it("should render with initial time and duration values", () => {
      const timeInput = screen.getByTestId(
        "current-time-input"
      ) as HTMLInputElement;
      const durationInput = screen.getByTestId(
        "duration-input"
      ) as HTMLInputElement;

      expect(timeInput).toHaveValue(initialTime);
      expect(durationInput).toHaveValue(initialDuration);
    });

    it("1.1. should update displayed time immediately while typing but not trigger setTime until input is confirmed", () => {
      const timeInput = screen.getByTestId("current-time-input");

      // Initial value check
      expect(timeInput).toHaveValue(initialTime);

      // Simulate typing '1500'
      fireEvent.change(timeInput, { target: { value: 200 } });
      expect(timeInput).toHaveValue(200); // Display updates immediately

      // Ensure setTime has not been called yet
      expect(setTimeMock).not.toHaveBeenCalled();

      const blurSpy = jest.spyOn(timeInput, "blur");
      // Confirm input with Enter
      fireEvent.keyDown(timeInput, { key: "Enter" });
      expect(blurSpy).toHaveBeenCalled(); // Ensure that blur is triggered

      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(200); // Now setTime should be called
    });

    it("1.1. should allow the Backspace and Delete keys to work properly", () => {
      const timeInput = screen.getByTestId("current-time-input");
      fireEvent.change(timeInput, { target: { value: "500" } });

      // Simulate Backspace
      fireEvent.keyDown(timeInput, { key: "Backspace" });
      fireEvent.change(timeInput, { target: { value: "50" } });
      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(50); // Backspace should change the value

      // Simulate Delete
      fireEvent.change(timeInput, { target: { value: "500" } });
      fireEvent.keyDown(timeInput, { key: "Delete" });
      fireEvent.change(timeInput, { target: { value: "0" } });
      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(0); // Delete should reset to 0
    });

    it("1.3. should immediately update on pressing step buttons", () => {
      const timeInput = screen.getByTestId("current-time-input");
      const durationInput = screen.getByTestId("duration-input");

      // Simulate step buttons (arrow keys)
      fireEvent.keyDown(timeInput, { key: "ArrowUp" });
      fireEvent.change(timeInput, { target: { value: "110" } });
      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(110); // Time updated by arrow keys

      fireEvent.keyDown(durationInput, { key: "ArrowDown" });
      fireEvent.change(durationInput, { target: { value: "590" } });
      fireEvent.blur(durationInput);
      expect(setDurationMock).toHaveBeenCalledWith(590); // Duration updated by arrow keys
    });

    it("1.8. should confirm the value and remove focus on Enter", () => {
      const timeInput = screen.getByTestId("current-time-input");
      const blurSpy = jest.spyOn(timeInput, "blur");

      fireEvent.change(timeInput, { target: { value: "205" } });
      fireEvent.keyDown(timeInput, { key: "Enter" });
      expect(blurSpy).toHaveBeenCalled(); // Ensure that blur is triggered
      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(210); // Rounded to nearest 10
      expect(timeInput).not.toHaveFocus(); // Input should lose focus
    });

    it("1.9. should reset the value to the original on Escape key", () => {
      const timeInput = screen.getByTestId("current-time-input");
      const blurSpy = jest.spyOn(timeInput, "blur");

      fireEvent.change(timeInput, { target: { value: "300" } });
      fireEvent.keyDown(timeInput, { key: "Escape" });
      expect(blurSpy).toHaveBeenCalled(); // Ensure that blur is triggered
      fireEvent.blur(timeInput);
      expect(timeInput).not.toHaveFocus(); // Input should lose focus
      expect(timeInput).toHaveValue(initialTime); // Resets to initial value (100)
    });

    it("1.9. should reset to the initial duration when pressing Escape in the duration input", () => {
      const durationInput = screen.getByTestId("duration-input");
      const blurSpy = jest.spyOn(durationInput, "blur");

      fireEvent.change(durationInput, { target: { value: "1000" } });
      fireEvent.keyDown(durationInput, { key: "Escape" });
      expect(blurSpy).toHaveBeenCalled(); // Ensure that blur is triggered
      fireEvent.blur(durationInput);
      expect(durationInput).toHaveValue(initialDuration); // Resets to initial duration (600)
    });

    it("1.11. should set time to 0 if the input is less than 0", () => {
      const timeInput = screen.getByTestId("current-time-input");
      fireEvent.change(timeInput, { target: { value: "-50" } });
      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(0); // Time should be set to 0
    });
  });

  describe("2. Play Controls Behavior", () => {
    it("2.1. should not allow time to exceed duration", () => {
      const timeInput = screen.getByTestId("current-time-input");
      fireEvent.change(timeInput, { target: { value: "700" } });
      fireEvent.blur(timeInput);
      expect(setTimeMock).toHaveBeenCalledWith(initialDuration); // Time should be set to duration (600)
    });

    it("2.3. should set duration to the maximum limit if exceeded", () => {
      const durationInput = screen.getByTestId("duration-input");
      fireEvent.change(durationInput, { target: { value: "7000" } });
      fireEvent.blur(durationInput);
      expect(setDurationMock).toHaveBeenCalledWith(maxDuration); // Duration should not exceed 6000
    });

    it("2.3. should set the minimum duration to 100 if the input is too low", () => {
      const durationInput = screen.getByTestId("duration-input");

      fireEvent.change(durationInput, { target: { value: "50" } });
      fireEvent.blur(durationInput);
      expect(setDurationMock).toHaveBeenCalledWith(minDuration); // Remains unchanged
    });

    it("2.4. should round decimal values to the nearest multiple of 10", () => {
      const timeInput = screen.getByTestId("current-time-input");
      const durationInput = screen.getByTestId("duration-input");

      fireEvent.change(timeInput, { target: { value: "105" } });
      fireEvent.blur(timeInput); // Simulate blur event
      expect(setTimeMock).toHaveBeenCalledWith(110); // Rounded to nearest 10

      fireEvent.change(durationInput, { target: { value: "595" } });
      fireEvent.blur(durationInput);
      expect(setDurationMock).toHaveBeenCalledWith(600); // Rounded to nearest 10
    });

    it("2.4. should restrict the duration to multiples of 10 and within limits", () => {
      const durationInput = screen.getByTestId("duration-input");

      fireEvent.change(durationInput, { target: { value: "1205" } });
      fireEvent.blur(durationInput);
      expect(setDurationMock).toHaveBeenCalledWith(1210); // Rounded to nearest 10
    });
  });
});
