// src/Components/ui/textarea.jsx
import React from "react";

export const Textarea = ({ ...props }) => {
  return (
    <textarea
      className="w-full p-2 border rounded-md resize-none"
      {...props}
    />
  );
};
