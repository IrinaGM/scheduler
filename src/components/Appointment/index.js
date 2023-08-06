import React from "react";

import "components/Appointment/styles.scss";
import {
  EMPTY,
  SHOW,
  CREATE,
  SAVING,
  DELETING,
  CONFIRM,
  EDIT,
  ERROR_SAVE,
  ERROR_DELETE,
} from "../../constants";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(props.interview ? SHOW : EMPTY);

  const isCreate = mode === CREATE ? true : false;

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
      .bookInterview(props.id, interview, isCreate)
      .then(() => transition(SHOW))
      .catch((error) => {
        transition(ERROR_SAVE, true);
        console.error("There has been an error", error);
      });
  };

  /**
   * handles the edit event of appointment
   */
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
   * handles the cancel event of appointment deletion and the close error window event
   */
  const handleCancel = () => {
    back();
  };

  return (
    <article className="appointment" data-testid="appointment">
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
          onCancel={handleCancel}
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
          onClose={handleCancel}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="An error occurred while trying deleting the appointment, please try again"
          onClose={handleCancel}
        />
      )}
    </article>
  );
}
