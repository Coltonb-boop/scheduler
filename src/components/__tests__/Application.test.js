import React from "react";

import { render, cleanup, waitForElement, fireEvent, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";
import axios from 'axios';
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const {getByText} = render(<Application />);

    await waitForElement(() => getByText("Monday"))

    fireEvent.click(getByText('Tuesday'));

    expect(getByText(/Leopold Silvers/i)).toBeInTheDocument();

  });

  it("loads data, books and interview and reduces the spots remaining for the first day by 1", async () => {
    const {container, debug} = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => getByText(appointment, 'Lydia Miller-Jones'));

    const day = getAllByTestId(container, 'day').find(day => 
      queryByText(day, 'Monday')
    );
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();

  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, 'appointment')[1];

    fireEvent.click(getByAltText(appointment, 'Delete'));
    
    fireEvent.click(getByText(appointment, 'Confirm'));
    
    await waitForElement(() => getByText(container, 'Monday'));
    
    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));
    
    expect(getByText(day, '2 spots remaining')).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointment = getAllByTestId(container, 'appointment').find(
      appointment => queryByText(appointment, 'Archie Cohen')
    );

    fireEvent.click(getByAltText(appointment, 'Edit'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByText(appointment, 'Save'));

    await waitForElement(() => getByText(container, 'Monday'));

    expect(getByText(appointment, 'Lydia Miller-Jones')).toBeInTheDocument();

    const day = getAllByTestId(container, 'day').find(day => queryByText(day, 'Monday'));

    expect(getByText(day, '1 spot remaining'));
  });

  it('shows the save error when failing to save an appointment', async () => {
    axios.put.mockRejectedValueOnce();

    const {container, debug} = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')[0];
    
    fireEvent.click(getByAltText(appointment, 'Add'));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, 'Save'));
    
    await waitForElement(() => getByText(appointment, 'Error'));

    expect(getByText(container, "Could not save the appointment.")).toBeInTheDocument();

  });

  it('shows the delete error when failing to delete an appointment', async () => {
    axios.delete.mockRejectedValueOnce();

    const {container, debug} = render(<Application />);
    
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, 'appointment')[1];
    
    fireEvent.click(getByAltText(appointment, 'Delete'));

    fireEvent.click(getByText(appointment, 'Confirm'));
    
    await waitForElement(() => getByText(appointment, 'Error'));

    expect(getByText(container, "Could not delete the appointment.")).toBeInTheDocument();
    
  });
  
});