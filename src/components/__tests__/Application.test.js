import React from "react";

import {
  getByText,
  getAllByTestId,
  getByPlaceholderText,
  getByAltText,
  queryByText,
  queryByAltText,
  render,
  cleanup,
  waitForElement,
  fireEvent,
  queryByTestId,
  getByDisplayValue,
} from "@testing-library/react";

import axios from "axios";

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

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. render the application
    const { container } = render(<Application />);

    // 2. wait for the element with the text "Archie Cohen"
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. find the first empty appointment
    const appointment = getAllByTestId(container, "appointment")[0];

    // 4. click on "Add" button on the first empty appointment
    fireEvent.click(getByAltText(appointment, "Add"));

    // 5. Enter the name "Lydia Miller-Jones" into the input with the placeholder "Enter Student Name".
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 6. Click the first interviewer in the list
    fireEvent.click(appointment.querySelector(`.interviewers__item`));

    // 7. Click the "Save" button on that same appointment.
    fireEvent.click(getByText(appointment, "Save"));

    // 8. Check that the element with the text "Saving..." is displayed.
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    // 9. Wait until the element with the text "Lydia Miller-Jones" is displayed.
    await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    // 10. Check that the DayListItem with the text "Monday" also has the text "no spots remaining".
    const monday = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(monday, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the appointment with the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToDelete = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Delete" button on that same appointment
    fireEvent.click(getByAltText(appointmentToDelete, "Delete"));

    // 4. Check that the element with the text "Are you sure you would like to delete the interview?" is displayed instead the appointment to delete
    await waitForElement(() =>
      queryByText(appointmentToDelete, "Are you sure you would like to delete the interview?")
    );

    // 5. Click the "Confirm" button on that same element.
    fireEvent.click(getByText(appointmentToDelete, "Confirm"));

    // 6. Check that the element with the text "Deleting..." is displayed.
    expect(getByText(appointmentToDelete, "Deleting...")).toBeInTheDocument();

    // 7. Check that the appointment with "Archie Cohen" is not displayed anymore.
    await waitForElement(() => queryByAltText(appointmentToDelete, "Add"));
    expect(queryByText(container, "Archie Cohen")).not.toBeInTheDocument();

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const monday = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(monday, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the appointment with the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToEdit = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Edit" button on that same appointment
    fireEvent.click(getByAltText(appointmentToEdit, "Edit"));

    // 4. Check that a edit form is rendered with the appointment to edit
    await waitForElement(() => queryByTestId(appointmentToEdit, "student-name-input"));

    // 5. change the input field to have value of "Lydia Miller-Jones"
    fireEvent.change(getByDisplayValue(appointmentToEdit, "Archie Cohen"), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 6. click the save button
    fireEvent.click(getByText(appointmentToEdit, "Save"));

    // 7. Check that the element with the text "Saving..." is displayed.
    expect(getByText(appointmentToEdit, "Saving...")).toBeInTheDocument();

    // 8. Check that the appointment with "Lydia Miller-Jones" is now displayed
    await waitForElement(() => queryByText(container, "Lydia Miller-Jones"));
    expect(queryByText(container, "Archie Cohen")).not.toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" has the text "1 spot remaining".
    const monday = getAllByTestId(container, "day").find((day) => queryByText(day, "Monday"));
    expect(getByText(monday, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment and able to return to appointment form", async () => {
    // replaces the mock module temporarily, until the put function is called once.
    axios.put.mockRejectedValueOnce({ status: 500, data: {} });

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the appointment with the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToEdit = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Edit" button on that same appointment
    fireEvent.click(getByAltText(appointmentToEdit, "Edit"));

    // 4. Check that a edit form is rendered with the appointment to edit
    await waitForElement(() => queryByTestId(appointmentToEdit, "student-name-input"));

    // 5. change the input field to have value of "Lydia Miller-Jones"
    fireEvent.change(getByDisplayValue(appointmentToEdit, "Archie Cohen"), {
      target: { value: "Lydia Miller-Jones" },
    });

    // 6. click the save button
    fireEvent.click(getByText(appointmentToEdit, "Save"));

    // 7. Check that the element with the text "Saving..." is displayed.
    expect(getByText(appointmentToEdit, "Saving...")).toBeInTheDocument();

    // 8. Check that the element with the text "An error occurred while trying saving the appointment, please try again" is displayed.
    await waitForElement(() =>
      getByText(
        appointmentToEdit,
        "An error occurred while trying saving the appointment, please try again"
      )
    );

    expect(
      getByText(
        appointmentToEdit,
        "An error occurred while trying saving the appointment, please try again"
      )
    ).toBeInTheDocument();

    // 9. Click on the "Close" button in the Error
    fireEvent.click(getByAltText(appointmentToEdit, "Close"));

    // 10. Check that the appointment that was edited shows the form with "Archie Cohen"
    await waitForElement(() => getByDisplayValue(appointmentToEdit, "Archie Cohen"));

    expect(getByDisplayValue(appointmentToEdit, "Archie Cohen")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment and able to return to the initial view of the appointment", async () => {
    // replaces the mock module temporarily, until the delete function is called once.
    axios.delete.mockRejectedValueOnce({ status: 500, data: {} });

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the appointment with the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointmentToDelete = getAllByTestId(container, "appointment").find((appointment) =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the "Delete" button on that same appointment
    fireEvent.click(getByAltText(appointmentToDelete, "Delete"));

    // 4. Check that the element with the text "Are you sure you would like to delete the interview?" is displayed instead the appointment to delete
    await waitForElement(() =>
      queryByText(appointmentToDelete, "Are you sure you would like to delete the interview?")
    );

    // 5. Click the "Confirm" button on that same element.
    fireEvent.click(getByText(appointmentToDelete, "Confirm"));

    // 6. Check that the element with the text "Deleting..." is displayed.
    expect(getByText(appointmentToDelete, "Deleting...")).toBeInTheDocument();

    // 7. Check that the element with the text "An error occurred while trying deleting the appointment, please try again" is displayed.
    await waitForElement(() =>
      getByText(
        appointmentToDelete,
        "An error occurred while trying deleting the appointment, please try again"
      )
    );

    expect(
      getByText(
        appointmentToDelete,
        "An error occurred while trying deleting the appointment, please try again"
      )
    ).toBeInTheDocument();

    // 8. Click on the "Close" button in the Error
    fireEvent.click(getByAltText(appointmentToDelete, "Close"));

    // 9. Check that the appointment that was not succeful in deletion still shows "Archie Cohen"
    await waitForElement(() => getByText(appointmentToDelete, "Archie Cohen"));
    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();
  });
});
