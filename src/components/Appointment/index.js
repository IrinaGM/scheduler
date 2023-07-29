import React from "react";

import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  /**
   * handles the save event of appointment creation
   * @param {string} name
   * @param {object} interviewer
   */
  const save = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch((error) => {
        transition(ERROR_SAVE, true);
        console.error("There has been an error", error);
      });
  };

  const edit = () => {
    transition(EDIT);
  };

  /**
   * handles the delete event of appointment
   */
  const handleDelete = () => {
    transition(CONFIRM);
  };

  /**
   * handles the confirm event of appointment deletion
   */
  const handleConfirmDelete = () => {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch((error) => {
        transition(ERROR_DELETE, true);
        console.error("There has been an error", error);
      });
  };

  /**
   * handles the cancel event of appointment deletion
   */
  const handleCancelDelete = () => {
    back();
  };

  /**
   * handles the close error window event
   * @param {string} view
   */
  const handleCloseErrorMsg = () => {
    back();
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={handleDelete}
          onEdit={edit}
        />
      )}
      {mode === CREATE && (
        <Form interviewers={props.interviewers} onCancel={() => back()} onSave={save} />
      )}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you would like to delete the interview?"
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      )}
      {mode === EDIT && (
        <Form
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          interviewers={props.interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message="An error occurred while trying saving the appointment, please try again"
          onClose={handleCloseErrorMsg}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="An error occurred while trying deleting the appointment, please try again"
          onClose={handleCloseErrorMsg}
        />
      )}
    </article>
  );
}
