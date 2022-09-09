import { useState } from "react";



export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  // replace is optional
  const transition = (newMode, replace = false) => {
    if (replace) {
      setHistory(prev => {
        const temp = prev.slice(0, -1);
        return [...temp, newMode];
      })
      setMode(newMode);
      return;
    }

    setHistory(prev => [...prev, newMode]);
    setMode(newMode);
  }

  const back = () => {
    if (history.length < 2) {
      return;
    }

    setHistory(prev => prev.slice(0, -1));
    setMode(history[history.length - 2])
  }
  
  return { mode, transition, back };
  
}
