import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode, transition = false) => {
    if (transition) {
      //if transition is true, remove from history the last mode, and add the new one.
      setHistory((prev) => {
        const prevRemovedLast = [...prev].slice(0, -1);
        return [...prevRemovedLast, newMode];
      });
    } else {
      setHistory((prev) => [...prev, newMode]);
    }

    // set the new mode
    setMode(newMode);
  };

  const back = () => {
    // if history has more modes apart of the initial one, allow to go back
    if (history.length > 1) {
      setHistory([...history].slice(0, -1));
      setMode(history[history.length - 2]);
    }
  };
  return { mode, transition, back };
}
