import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (newMode) => {
    setHistory((prev) => [...prev, newMode]);
    setMode(newMode);
  };

  const back = () => {
    if (history.length > 1) {
      setHistory([...history].slice(0, -1));
      setMode(history[history.length - 2]);
    }
  };
  return { mode, transition, back };
}
