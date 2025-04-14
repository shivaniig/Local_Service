// src/components/ui/badge.jsx
import React from "react";

export const Badge = ({ children, className = "" }) => {
  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full ${className}`}>
      {children}
    </span>
  );
};
