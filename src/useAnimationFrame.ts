import React from "react";

export function useAnimationFrame(callback) {
  const requestRef = React.useRef<number>();

  function handleCallback() {
    callback();
    requestRef.current = requestAnimationFrame(handleCallback);
  }

  React.useEffect(() => {
    requestRef.current = requestAnimationFrame(handleCallback);
    return () => cancelAnimationFrame(requestRef.current);
  }, []); // Make sure the effect runs only once
}
