import React from "react";
import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./";
import { API } from "@/utils";
import { deleteGame, getAllGames } from "@/api/game";
import { BrowserRouter } from "react-router-dom";

jest.mock("@/utils");
jest.mock("@/api/game");

const mockTriggerSnackbar = jest.fn();

jest.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    triggerSnackbar: mockTriggerSnackbar,
  }),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Import and retain the original functionalities
  useNavigate: () => mockNavigate,
}));

// Mock for window.confirm (used in the delete confirmation dialog)
global.confirm = jest.fn(() => true); // Simulate user clicking "OK"

const gamesMock = [
  { id: "1", name: "D1G1" },
  { id: "2", name: "D2G2" },
];

const mockDashboardData = {
  results: [
    {
      player_name: "John Doe",
      assists: 1111,
      blocks: 2222,
      field_goals_attempted: 3333,
      field_goals_made: 4444,
      points: 5555,
      rebounds: 6666,
      steals: 7777,
      three_points_attempted: 8888,
      three_points_made: 9999,
      turnovers: 1212,
    },
  ],
};

beforeEach(() => {
  // Mock the specific API.get call
  API.get.mockImplementation((url) => {
    if (url.startsWith(`/api/dashboard`)) {
      return Promise.resolve(mockDashboardData);
    }
    return Promise.resolve({ results: [] });
  });

  getAllGames.mockResolvedValue({ results: gamesMock });
  deleteGame.mockResolvedValue({ results: ["2"] }); // Assuming deleting game with ID '2'
});

describe("Home Component", () => {
  test("initially fetches games and renders them in select", async () => {
    const { findByText } = render(<Home />, { wrapper: BrowserRouter });

    expect(await findByText("D1G1")).not.toBeNull();
    expect(await findByText("D2G2")).not.toBeNull();
  });

  test("handles game selection and fetches dashboard data", async () => {
    render(<Home />, { wrapper: BrowserRouter });

    // Open the dropdown for game selection
    const select = screen.getByRole("combobox");
    userEvent.click(select);

    // Wait for the options to be in the document
    // Adjust the query to find your options. If MUI renders them as listbox options, they might not be directly accessible as 'option' roles without additional setup.
    const options = await screen.findAllByRole("option");
    expect(options).toHaveLength(gamesMock.length); // Ensure we have the expected number of options

    // Click on the first option
    userEvent.click(options[1]);

    // Here you expect the dashboard fetch function to be called with the correct game name
    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith(
        `/api/dashboard?gameId=${gamesMock[1].name}`
      );
    });

    expect(
      screen.getByText(mockDashboardData.results[0].player_name)
    ).toBeInTheDocument();
    expect(screen.getByText("4444")).toBeInTheDocument();
    expect(screen.getByText("3333")).toBeInTheDocument();
    expect(screen.getByText("9999")).toBeInTheDocument();
    expect(screen.getByText("8888")).toBeInTheDocument();
    expect(screen.getByText("6666")).toBeInTheDocument();
    expect(screen.getByText("1111")).toBeInTheDocument();
    expect(screen.getByText("7777")).toBeInTheDocument();
    expect(screen.getByText("2222")).toBeInTheDocument();
    expect(screen.getByText("1212")).toBeInTheDocument();
    expect(screen.getByText("5555")).toBeInTheDocument();
  });

  test('navigates to edit page on "Edit Game" button click', async () => {
    render(<Home />, { wrapper: BrowserRouter });

    // Assuming the first game is selected to enable the "Edit Game" button
    const select = screen.getByRole("combobox");
    userEvent.click(select);

    const options = await screen.findAllByRole("option");
    userEvent.click(options[0]); // Select the first game

    await waitFor(() => {
      // Find and click the "Edit Game" button
      const editButton = screen.getByRole("button", { name: /Edit Game/i });
      userEvent.click(editButton);

      // Verify navigation was called with the correct path
      expect(mockNavigate).toHaveBeenCalledWith(
        `/data-entry/${gamesMock[0].id}`
      );
    });
  });

  test('deletes a game on "Delete Game" button click', async () => {
    render(<Home />, { wrapper: BrowserRouter });

    // Assuming the first game is selected to enable the "Delete Game" button
    const select = screen.getByRole("combobox");
    userEvent.click(select);

    const options = await screen.findAllByRole("option");
    userEvent.click(options[0]); // Select the first game

    await waitFor(() => {
      const editButton = screen.getByRole("button", { name: /Edit Game/i });
      expect(editButton).not.toBeNull();
    });

    // Click the "Delete Game" button
    const deleteButton = screen.getByRole("button", { name: /Delete Game/i });
    await userEvent.click(deleteButton);

    // Verify that window.confirm was called
    expect(global.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this game?"
    );

    // Assuming API call to delete game goes through and snackbar is triggered
    await waitFor(() => {
      expect(deleteGame).toHaveBeenCalledWith(gamesMock[0].id);
    });
  });
});
