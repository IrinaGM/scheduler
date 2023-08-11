import React from "react";
import { render, cleanup, act } from "@testing-library/react";
import Appointment from "components/Appointment";

afterEach(cleanup);

describe("Appointment", () => {
  it("renders without crashing", () => {
    act(() => {
      render(<Appointment />);
    });
  });
});
