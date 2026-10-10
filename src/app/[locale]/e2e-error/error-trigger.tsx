"use client";

import {useState} from "react";

interface ErrorTriggerProps {
  label: string;
}

export function ErrorTrigger({label}: ErrorTriggerProps) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error("E2E_PRIVATE_DIAGNOSTIC");
  }

  return (
    <button type="button" onClick={() => setShouldThrow(true)}>
      {label}
    </button>
  );
}
