import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ErrorProvider from "../error";

const mockErrorMessage = "Test error";

//////////////////////////////////////////////
// Code component logic tests:
//
// ->  Developers's responsability
//////////////////////////////////////////////
describe("ErrorContext general error", () => {
  const TestComponent = () => {
    throw Error(mockErrorMessage);
  };

  render(
    <ErrorProvider>
      <TestComponent />
    </ErrorProvider>
  );

  test("Should show the error component", async () => {
    await waitFor(async () => {
      const errorComponent = await screen.findAllByTestId("errorContainer");
      expect(errorComponent.length).toBe(1);
    });
  });
});

/////////////////////////////////////////
// TODO: Implement the following tests:

// describe("ErrorContext type error", () => {

// });

// describe("ErrorContext hook error", () => {

// });
