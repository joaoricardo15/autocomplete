import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { SearchResult, SearchResultTypes } from "../interfaces";
import * as Api from "../api";
import Autocomplete from "..";

const mockResults: SearchResult[] = [
  {
    name: "joaoricardo15",
    type: SearchResultTypes.user,
    url: "https://github.com/joaoricardo15",
  },
];

/////////////////////////////////////////////////////////////////
// Business logic tests:
//
// ->  Test coverage's responsability is
//     shared between developers and stakeholders
////////////////////////////////////////////////////////////////
describe("Minimal chars number to initialize search: 3", () => {
  render(<Autocomplete />);
  const input = screen.getByTestId("input") as HTMLInputElement;

  test("should render input", () => {
    expect(input).toBeInTheDocument();
  });

  test("should not trigger fetch with input smaller than 3 characters", async () => {
    jest
      .spyOn(Api, "fetchAndMergeSearchResults")
      .mockResolvedValue(mockResults);

    fireEvent.change(input, { target: { value: "j" } });
    expect(input.value).toBe("j");

    await waitFor(
      () => expect(Api.fetchAndMergeSearchResults).toHaveBeenCalledTimes(0),
      {
        // Debounce time
        timeout: 500,
      }
    );
  });

  test("should trigger fetch with input bigger of equal than 3 characters", async () => {
    jest
      .spyOn(Api, "fetchAndMergeSearchResults")
      .mockResolvedValue(mockResults);

    fireEvent.change(input, { target: { value: "joao" } });
    expect(input.value).toBe("joao");

    await waitFor(
      () => expect(Api.fetchAndMergeSearchResults).toHaveBeenCalledTimes(1),
      {
        // Debounce time
        timeout: 1000,
      }
    );
  });
});

/////////////////////////////////////////
// TODO: Implement the following tests:

// describe("Result items are combined and displayed alphabetically using repository and profile name as ordering keys", () => {

// });

// describe("Number of result items should be limited to 50 per request", () => {

// });

// describe("The component should give visual feedback for when the data is being fetched, the results are empty, or the request resulted in an error", () => {

// });

// describe("The component supports keyboard strokes (up and down arrows to browse the results, enter to open a new tab with the repository/user page)", () => {

// });
