// DataEntryHeader.test.jsx
import React from "react";
import { render, screen, within, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import DataEntryHeader from "./";
import * as utils from "../../utils";

// Mock the utility functions
jest.mock("../../utils", () => ({
  getGameName: jest.fn(),
  getDate: jest.fn(),
}));

describe("DataEntryHeader", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("displays the date and game name from gameData", () => {
    // Setup mock return values for utility functions
    const mockDate = "2024-03-16";
    const mockGameName = "D1G12";
    utils.getDate.mockReturnValue(mockDate);
    utils.getGameName.mockReturnValue(mockGameName);

    // Mock gameData
    const gameData = [
      {
        date: "2024-03-16",
        name: "D1G12",
      },
    ];

    render(<DataEntryHeader gameData={gameData} />);

    const dateDisplayElement = screen.getByTestId("dateDisplay");
    expect(
      within(dateDisplayElement).getByText(`${mockDate}`)
    ).toBeInTheDocument();

    const gameNameDisplayElement = screen.getByTestId("gameNameDisplay");
    expect(
      within(gameNameDisplayElement).getByText(`${mockGameName}`)
    ).toBeInTheDocument();
  });

  it('displays "N/A" if date or game name is not available', () => {
    render(<DataEntryHeader />);

    const dateDisplayElement = screen.getByTestId("dateDisplay");
    expect(within(dateDisplayElement).getByText("N/A")).toBeInTheDocument();

    const gameNameDisplayElement = screen.getByTestId("gameNameDisplay");
    expect(within(gameNameDisplayElement).getByText("N/A")).toBeInTheDocument();
  });
});
