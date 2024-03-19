import { action } from "."; // Adjust the import path as needed
import { redirect } from "react-router-dom";
import { createGame } from "@/api/stat-entry";

// Mock the external dependencies
jest.mock("react-router-dom", () => ({
  redirect: jest.fn(),
}));

jest.mock("@/api/stat-entry", () => ({
  createGame: jest.fn(),
}));

describe("GameDateEntry action tests", () => {
  it("redirects to the data-entry page when results are present", async () => {
    // Setup
    const mockFormData = new Map([["key", "value"]]);
    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    };
    const mockParams = {}; // Add params if necessary
    const mockResults = { results: [{ id: "123" }] };

    createGame.mockResolvedValue(mockResults);

    // Execute
    await action({ request: mockRequest, params: mockParams });

    // Assert
    expect(createGame).toHaveBeenCalledWith(Object.fromEntries(mockFormData));
    expect(redirect).toHaveBeenCalledWith(
      `/data-entry/${mockResults.results[0].id}`
    );
  });

  it("redirects to the home page when no results are present", async () => {
    // Setup
    const mockFormData = new Map();
    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    };
    const mockParams = {};
    const mockResults = { results: [] };

    createGame.mockResolvedValue(mockResults);

    // Execute
    await action({ request: mockRequest, params: mockParams });

    // Assert
    expect(createGame).toHaveBeenCalledWith(Object.fromEntries(mockFormData));
    expect(redirect).toHaveBeenCalledWith(`/home`);
  });

  it("redirects to the home page when no results at all", async () => {
    // Setup
    const mockFormData = new Map();
    const mockRequest = {
      formData: () => Promise.resolve(mockFormData),
    };
    const mockParams = {};
    const mockResults = {};

    createGame.mockResolvedValue(mockResults);

    // Execute
    await action({ request: mockRequest, params: mockParams });

    // Assert
    expect(createGame).toHaveBeenCalledWith(Object.fromEntries(mockFormData));
    expect(redirect).toHaveBeenCalledWith(`/home`);
  });
});
