import { useEffect, useRef } from "react";

export function useAnimationFrame(callback) {
  const requestRef = useRef<number>();

  function handleCallback() {
    callback();
    requestRef.current = requestAnimationFrame(handleCallback);
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(handleCallback);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
}
