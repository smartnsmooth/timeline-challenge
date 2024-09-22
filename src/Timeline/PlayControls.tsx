import React, { useState, useRef } from "react";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = ({ time, setTime, duration, setDuration }: PlayControlsProps) => {
  const minDuration = 100;
  const maxDuration = 6000;
  const inputStep = 10;

  const [timeInputValue, setTimeInputValue] = useState(time);
  const [durationInputValue, setDurationInputValue] = useState(duration);
  const [editing, setEditing] = useState(false);
  const escPressedRef = useRef(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setInputValue: (value: number) => void,
    validateAndSet: (value: number) => void
  ) => {
    const eValue = Number(e.target.value);

    if (!editing) {
      validateAndSet(eValue); // Update immediately when clicking step buttons
    } else {
      setInputValue(eValue); // Update input value state
    }
    setEditing(false); // Reset after change
  };

  // Generalized input blur handler
  const handleInputBlur = (inputValue: number, validateAndSet: (value: number) => void) => {
    // if (!escPressedRef.current) {
      validateAndSet(inputValue); // Validate and update on blur
    // }
    // escPressedRef.current = false;
  };

  // Generalized key down handler for Enter and digit keys
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    inputValue: number,
    validateAndSet: (value: number) => void
  ) => {
    if (e.key === "Enter") {
      validateAndSet(inputValue); // Confirm value on Enter
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      // setInputValue(time); // Track when a digit is pressed
      escPressedRef.current = true;
      (e.target as HTMLInputElement).blur();
    } else if (/^[0-9]$/.test(e.key) || e.key === "Backspace" || e.key === "Delete") {
      setEditing(true); // Track when a digit is pressed
    }
  };

  // Generalized focus handler to select all text
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select(); // Select all text when input gains focus
  };

  // Validate and set time
  const validateAndSetTime = (value: number) => {
    if (escPressedRef.current) {
      setTimeInputValue(time);
      escPressedRef.current = false;
    } else {
      value = Math.round(value / 10) * 10;
      if (value < 0) {
        setTime(0);
        setTimeInputValue(0);
      } else if (value > duration) {
        setTime(duration);
        setTimeInputValue(duration);
      } else {
        setTime(value);
        setTimeInputValue(value); // Reset to original time if out of bounds
      }
    }
  };

  // Validate and set duration
  const validateAndSetDuration = (value: number) => {
    if (escPressedRef.current) {
      setDurationInputValue(duration);
      escPressedRef.current = false;
    } else {
      value = Math.round(value / 10) * 10;
      if (value < minDuration) {
        setDuration(minDuration);
        setDurationInputValue(minDuration);
      } else if (value > maxDuration) {
        setDuration(maxDuration);
        setDurationInputValue(maxDuration);
      } else {
        setDuration(value);
        setDurationInputValue(value); // Reset to original time if out of bounds
      }
    }
  };

  return (
    <div
      className="flex items-center justify-between border-b border-r border-solid border-gray-700 px-2"
      data-testid="play-controls"
    >
      <fieldset className="flex gap-1">
        Current
        <input
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="current-time-input"
          min={0}
          max={duration}
          step={inputStep}
          value={timeInputValue.toString()}
          onChange={(e) => handleInputChange(e, setTimeInputValue, validateAndSetTime)}
          onBlur={() => handleInputBlur(timeInputValue, validateAndSetTime)}
          onKeyDown={(e) => handleKeyDown(e, timeInputValue, validateAndSetTime)}
          onFocus={handleInputFocus}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="duration-input"
          min={minDuration}
          max={maxDuration}
          step={inputStep}
          value={durationInputValue.toString()}
          onChange={(e) => handleInputChange(e, setDurationInputValue, validateAndSetDuration)}
          onBlur={() => handleInputBlur(durationInputValue, validateAndSetDuration)}
          onKeyDown={(e) => handleKeyDown(e, durationInputValue, validateAndSetDuration)}
          onFocus={handleInputFocus}
        />
        Duration
      </fieldset>
    </div>
  );
};
