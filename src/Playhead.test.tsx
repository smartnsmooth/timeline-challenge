import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Playhead } from "./Timeline/Playhead"; // Adjust the import as necessary

describe("Playhead Component", () => {
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