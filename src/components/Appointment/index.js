import React from "react";

import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "../../hooks/useVisualMode";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";

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

    props.bookInterview(props.id, interview).then(() => transition(SHOW));
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
    transition(DELETING);
    props.cancelInterview(props.id).then(() => transition(EMPTY));
  };

  /**
   * handles the cancel event of appointment deletion
   */
  const handleCancelDelete = () => {
    transition(SHOW);
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
    </article>
  );
}
