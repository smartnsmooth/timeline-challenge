import React, { useState, useCallback } from "react";

type PlayControlsProps = {
  time: number;
  setTime: (time: number) => void;
  duration: number;
  setDuration: (duration: number) => void;
};

export const PlayControls = ({
  time,
  setTime,
  duration,
}: PlayControlsProps) => {
  const [inputValue, setInputValue] = useState(time);
  const [digitPressed, setDigitPressed] = useState(false);

  const validateAndSetTime = (value: number) => {
    if (value >= 0 && value <= duration) {
      setTime(value);
    } else {
      setInputValue(time); // Reset to original time if out of bounds
    }
  };

  const onInputBlur = useCallback(() => {
    validateAndSetTime(inputValue);
  }, [inputValue, time, duration]);

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const eValue = Number(e.target.value);
      // Immediate update when clicking step buttons
      if (Math.abs(eValue - inputValue) === 10 && !digitPressed) {
        validateAndSetTime(eValue);
      }
      setInputValue(eValue); // Always update the display
      setDigitPressed(false); // Reset after processing
    },
    [inputValue, digitPressed, duration]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        validateAndSetTime(inputValue);
      } else if (/^[0-9]$/.test(e.key)) {
        setDigitPressed(true); // Only set this flag on digit press
      }
    },
    [inputValue, duration]
  );

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
          step={10}
          value={inputValue}
          onChange={onInputChange}
          onBlur={onInputBlur}
          onKeyDown={onKeyDown}
        />
      </fieldset>
      -
      <fieldset className="flex gap-1">
        <input
          className="bg-gray-700 px-1 rounded"
          type="number"
          data-testid="duration-input"
          min={100}
          max={2000}
          step={10}
          defaultValue={duration}
        />
        Duration
      </fieldset>
    </div>
  );
};
