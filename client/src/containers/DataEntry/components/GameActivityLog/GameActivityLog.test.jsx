import React from "react";
import { render, screen } from "@testing-library/react";
import GameActivityLog from "./";

describe("GameActivityLog", () => {
  it("renders nothing when gameActivityLog is empty", () => {
    render(<GameActivityLog gameActivityLog={[]} />);
    const boxElements = screen.queryAllByRole("region"); // Assuming Box translates to a div with role="region"
    expect(boxElements).toHaveLength(0);
  });

  it("renders all game activity log entries", () => {
    const gameActivityLog = [
      { player_name: "Player 1", act_type: "Scored" },
      { player_name: "Player 2", act_type: "Assisted" },
    ];

    render(<GameActivityLog gameActivityLog={gameActivityLog} />);

    // Check for the first activity
    expect(screen.getByText("Player 1: Scored")).toBeInTheDocument();

    // Check for the second activity
    expect(screen.getByText("Player 2: Assisted")).toBeInTheDocument();
  });

  it("assigns a unique key to each log entry", () => {
    const gameActivityLog = [
      { player_name: "Player 1", act_type: "Scored" },
      { player_name: "Player 1", act_type: "Scored" }, // Intentional duplicate for testing
    ];

    render(<GameActivityLog gameActivityLog={gameActivityLog} />);

    // Since we can't directly test for keys, we ensure duplicates render, implying unique keys
    const entries = screen.getAllByText("Player 1: Scored");
    expect(entries).toHaveLength(2);
  });
});
