import React from "react";

import { render, cleanup, waitForElement, fireEvent } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  // render the application
  const { getByText } = render(<Application />);

  //wait for the element with the text "Monday"
  await waitForElement(() => getByText("Monday"));

  // click on Tuesday
  fireEvent.click(getByText("Tuesday"));

  // assert about the appointments to include "Leopold Silvers"
  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});
