import React from "react";
import { render, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
import ButtonBlock from "./"; // Adjust the import path as necessary
import { createActLog } from "@/api/act";

// Mock the API module
jest.mock("@/api/act", () => ({
  createActLog: jest.fn(),
}));

// Mock the STATS object
jest.mock("@/constants", () => ({
  STATS: {
    twoPtMiss: "TWO_PT_MISS",
    twoPtMake: "TWO_PT_MAKE",
    threePtMiss: "THREE_PT_MISS",
    threePtMake: "THREE_PT_MAKE",
    rebound: "REBOUND",
    assist: "ASSIST",
    steal: "STEAL",
    block: "BLOCK",
    turnover: "TURNOVER",
  },
}));

// Since we mocked it above
createActLog.mockResolvedValue({}); // Assuming createActLog resolves to something

describe("ButtonBlock", () => {
  it("updates stats and activity log on button click", async () => {
    const mockSetGameStats = jest.fn();
    const mockSetGameActivityLog = jest.fn();
    const gameStats = [{ player_id: 1, fga: 0, fgm: 0 }];
    const gameActivityLog = [];

    const { getByText } = render(
      <ButtonBlock
        name="Player 1"
        playerId={1}
        teamId={100}
        gameStats={gameStats}
        setGameStats={mockSetGameStats}
        gameActivityLog={gameActivityLog}
        setGameActivityLog={mockSetGameActivityLog}
        date="2024-03-16"
        gameId={1}
      />
    );

    fireEvent.click(getByText("2Pt Miss"));

    // Since handleStatChange is async, we wait for the next tick
    await new Promise(process.nextTick);

    expect(mockSetGameStats).toHaveBeenCalled();
    expect(mockSetGameActivityLog).toHaveBeenCalled();
    expect(createActLog).toHaveBeenCalledWith({
      playerId: 1,
      actType: "TWO_PT_MISS",
      date: "2024-03-16",
      gameId: 1,
      teamId: 100,
    });
  });
});
