import React from "react";

import {
  getByText,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  render,
  cleanup,
  waitForElement,
  fireEvent,
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
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

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // render the application
    const { container } = render(<Application />);

    //wait for the element with the text "Archie Cohen"
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // find the first empty appointment
    const appointment = getAllByTestId(container, "appointment")[0];

    // click on "Add" button on the first empty appointment
    fireEvent.click(getByAltText(appointment, "Add"));

    // Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // Click the first interviewer in the list
    fireEvent.click(appointment.querySelector(`.interviewers__item`));

    // Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // Check that the element with the text "Saving..." is displayed.
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const monday = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });
});
