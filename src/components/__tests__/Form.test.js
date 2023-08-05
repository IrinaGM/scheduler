import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import Form from "components/Appointment/Form";

afterEach(cleanup);

describe("Form", () => {
  const interviewers = [
    {
      id: 1,
      student: "Sylvia Palmer",
      avatar: "https://i.imgur.com/LpaY82x.png",
    },
  ];

  it("renders without student name if not provided", () => {
    const { getByPlaceholderText } = render(<Form interviewers={interviewers} />);
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
  });

  it("renders with initial student name", () => {
    const { getByTestId } = render(
      <Form interviewers={interviewers} student="Lydia Miller-Jones" />
    );
    expect(getByTestId("student-name-input")).toHaveValue("Lydia Miller-Jones");
  });

  it("validates that the student name is not blank", () => {
    // mock onSave function
    const onSave = jest.fn();

    // Render the Form with interviewers and the onSave mock function passed as an onSave prop, the student prop should be blank or undefined
    const { getByText } = render(<Form interviewers={interviewers} onSave={onSave} />);

    // click the save button
    fireEvent.click(getByText("Save"));

    // assert about the result the render and click
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("validates that the interviewer cannot be null", () => {
    // mock onSave function
    const onSave = jest.fn();

    // Render the Form with interviewers and the onSave mock function passed as an onSave prop, the interviewer prop should be null
    const { getByText } = render(
      <Form interviewers={interviewers} onSave={onSave} student="Lydia Miller-Jones" />
    );

    // Click the save button
    fireEvent.click(getByText("Save"));

    // assert about the result the render and click
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it("can successfully save after trying to submit an empty student name or without interviewer selected", () => {
    // mock onSave function
    const onSave = jest.fn();

    // Render the Form
    const { getByText, getByPlaceholderText, queryByText, container } = render(
      <Form interviewers={interviewers} onSave={onSave} />
    );

    // click the save button
    fireEvent.click(getByText("Save"));

    // assert about the result of the render and click
    expect(getByText(/student name cannot be blank/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    // change the input field to have value of "Lydia Miller-Jones"
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    // click the save button
    fireEvent.click(getByText("Save"));

    // assert about the result of new click on save
    expect(getByText(/please select an interviewer/i)).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();

    fireEvent.click(container.querySelector("img[src='https://i.imgur.com/LpaY82x.png']"));

    // click the save button
    fireEvent.click(getByText("Save"));

    // assert about the result on new click
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(queryByText(/please select an interviewer/i)).toBeNull();
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("Lydia Miller-Jones", 1);
  });

  it("calls onCancel and resets the input field", () => {
    // mock onCancel function
    const onCancel = jest.fn();

    // render the form
    const { getByText, getByPlaceholderText, queryByText } = render(
      <Form
        interviewers={interviewers}
        student="Anni Lenni"
        onSave={jest.fn()}
        onCancel={onCancel}
      />
    );

    // click the save button
    fireEvent.click(getByText("Save"));

    // change the input field to have value of "Lydia Miller-Jones"
    fireEvent.change(getByPlaceholderText("Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" },
    });

    // click the cancel button
    fireEvent.click(getByText("Cancel"));

    // assert about the result after click on Cancel button
    expect(queryByText(/student name cannot be blank/i)).toBeNull();
    expect(getByPlaceholderText("Enter Student Name")).toHaveValue("");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
