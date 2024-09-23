import React, { useEffect, useState, useRef } from "react";

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
  const escPressedRef = useRef(false);
  const mouseDownedRef = useRef(false);
  const arrowClickedRef = useRef(false);

  useEffect(() => {
    setTimeInputValue(time);
    setDurationInputValue(duration);
  }, [time, duration]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setInputValue: (value: number) => void) => {
    const eValue = Number(e.target.value);
    setInputValue(eValue);
    if (mouseDownedRef.current) {
      mouseDownedRef.current = false;
      arrowClickedRef.current = true;
    }
  };

  const handleInputBlur = (inputValue: number, validateAndSet: (value: number) => void) => {
    validateAndSet(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      escPressedRef.current = true;
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    value: number,
    validateAndSet: (value: number) => void
  ) => {
    if (e.key === "Escape") {
      escPressedRef.current = false;
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      validateAndSet(value);
    }
  };

  const handleMouseDown = () => {
    arrowClickedRef.current = false;
    mouseDownedRef.current = true;
  };

  const handleMouseUp = (value: number, validateAndSet: (value: number) => void) => {
    if (arrowClickedRef.current) {
      validateAndSet(value);
      arrowClickedRef.current = false;
    }
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const validateAndSetTime = (inputValue: number) => {
    if (escPressedRef.current) {
      setTimeInputValue(time);
      escPressedRef.current = false;
    } else {
      const value = Math.round(inputValue / 10) * 10;
      if (value < 0) {
        setTime(0);
      } else if (value > duration) {
        setTime(duration);
      } else {
        setTime(value);
      }
    }
  };

  const validateAndSetDuration = (inputValue: number) => {
    if (escPressedRef.current) {
      setDurationInputValue(duration);
      escPressedRef.current = false;
    } else {
      const value = Math.round(inputValue / 10) * 10;
      if (value < minDuration) {
        setDuration(minDuration);
      } else if (value > maxDuration) {
        setDuration(maxDuration);
      } else {
        setDuration(value);
        if (time > value) {
          setTime(value);
        }
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
          onChange={(e) => handleInputChange(e, setTimeInputValue)}
          onBlur={() => handleInputBlur(timeInputValue, validateAndSetTime)}
          onKeyDown={(e) => handleKeyDown(e)}
          onKeyUp={(e) => handleKeyUp(e, timeInputValue, validateAndSetTime)}
          onMouseDown={() => handleMouseDown()}
          onMouseUp={() => handleMouseUp(timeInputValue, validateAndSetTime)}
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
          onChange={(e) => handleInputChange(e, setDurationInputValue)}
          onBlur={() => handleInputBlur(durationInputValue, validateAndSetDuration)}
          onKeyDown={(e) => handleKeyDown(e)}
          onKeyUp={(e) => handleKeyUp(e, durationInputValue, validateAndSetDuration)}
          onMouseDown={() => handleMouseDown()}
          onMouseUp={() => handleMouseUp(durationInputValue, validateAndSetDuration)}
          onFocus={handleInputFocus}
        />
        Duration
      </fieldset>
    </div>
  );
};
