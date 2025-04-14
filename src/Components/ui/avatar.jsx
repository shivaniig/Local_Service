// src/components/ui/avatar.jsx
import React from "react";

export const Avatar = ({ children, className = "" }) => {
  return (
    <div className={`inline-block rounded-full overflow-hidden w-10 h-10 ${className}`}>
      {children}
    </div>
  );
};

export const AvatarImage = ({ src, alt = "avatar", className = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
    />
  );
};

export const AvatarFallback = ({ children, className = "" }) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center bg-gray-300 text-sm font-semibold text-white ${className}`}
    >
      {children}
    </div>
  );
};
