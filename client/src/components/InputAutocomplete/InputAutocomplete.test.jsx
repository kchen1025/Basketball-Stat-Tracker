import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import InputAutocomplete from "./";

const players = [
  { id: "1", name: "Player One" },
  { id: "2", name: "Player Two" },
];
const allSelectedPlayers = []; // Assuming 'Player Two' is already selected

describe("InputAutocomplete", () => {
  it("opens the modal when adding a new player", async () => {
    render(
      <InputAutocomplete
        players={players}
        allSelectedPlayers={allSelectedPlayers}
        teamId={0}
        onExistingPlayerSelected={() => {}}
        onNewPlayerAdded={() => {}}
      />
    );

    // Simulate typing a player's name not in the list
    userEvent.type(screen.getByRole("combobox"), "Player Three{enter}");

    // Wait for the modal to open
    await waitFor(() => {
      expect(screen.getByText("Add a new player")).toBeInTheDocument();
    });
  });

  it("disables the input when teamId has a non-zero value", async () => {
    render(
      <InputAutocomplete
        players={players}
        allSelectedPlayers={allSelectedPlayers}
        teamId={123}
        onExistingPlayerSelected={() => {}}
        onNewPlayerAdded={() => {}}
      />
    );

    const input = screen.getByRole("combobox");
    expect(input).toBeDisabled();
  });

  it("calls onNewPlayerAdded when submitting the form in the modal", async () => {
    const handleNewPlayerAdded = jest.fn();
    render(
      <InputAutocomplete
        players={players}
        allSelectedPlayers={allSelectedPlayers}
        teamId={0}
        onExistingPlayerSelected={() => {}}
        onNewPlayerAdded={handleNewPlayerAdded}
      />
    );

    // Open the modal first
    userEvent.type(screen.getByRole("combobox"), "Player Three{enter}");

    // Fill the form and submit
    await waitFor(() => {
      screen.getByRole("textbox", { name: /name/i });
    });
    userEvent.click(screen.getByRole("button", { name: /add/i }));

    await waitFor(() => {
      expect(handleNewPlayerAdded).toHaveBeenCalledWith("Player Three");
    });
  });

  it("calls onExistingPlayerSelected when selecting an existing player", async () => {
    const handleExistingPlayerSelected = jest.fn();
    render(
      <InputAutocomplete
        players={players}
        allSelectedPlayers={allSelectedPlayers}
        teamId={0}
        onExistingPlayerSelected={handleExistingPlayerSelected}
        onNewPlayerAdded={() => {}}
      />
    );

    // Simulate selecting an existing player
    userEvent.click(screen.getByRole("combobox"));
    await waitFor(() => {
      userEvent.click(screen.getByText("Player One"));
    });

    await waitFor(() => {
      expect(handleExistingPlayerSelected).toHaveBeenCalledWith({
        id: "1",
        name: "Player One",
      });
    });
  });

  it("players in input disabled if disabled passed in", async () => {
    const handleExistingPlayerSelected = jest.fn();
    render(
      <InputAutocomplete
        players={players}
        allSelectedPlayers={["1"]}
        teamId={0}
        onExistingPlayerSelected={handleExistingPlayerSelected}
        onNewPlayerAdded={() => {}}
      />
    );

    // Simulate selecting an existing player
    userEvent.click(screen.getByRole("combobox"));
    await waitFor(() => {});

    const listbox = await screen.findByRole("listbox");

    await waitFor(() => {
      // Assuming that your dropdown renders options within a listbox role

      // Find the specific option for 'Player Two'
      const playerOneOption = within(listbox).getByText("Player One");

      // Check if 'Player Two' option is part of the document and then check if it's disabled.
      // Note: You might need to adjust the method of checking the disabled state based on how your dropdown renders disabled options.
      // This example assumes disabled options are still in the document but not interactable.
      expect(playerOneOption).toBeInTheDocument();
      expect(playerOneOption).toHaveAttribute("aria-disabled", "true");
    });
  });
});
