import { useState } from "react";

export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  console.log({ history });

  const transition = (newMode, replace = false) => {
    if (replace) {
      //if replace is true, remove from history the last mode, and add the new one.
      setHistory((currState) => {
        const prevRemovedLast = [...currState].slice(0, -1);
        return [...prevRemovedLast, newMode];
      });
    } else {
      setHistory((currState) => [...currState, newMode]);
    }
  };

  const back = () => {
    // if history has more modes apart of the initial one, allow to go back
    if (history.length > 1) {
      setHistory((currState) => [...currState].slice(0, -1));
    }
  };
  return { mode: history[history.length - 1], transition, back };
}
