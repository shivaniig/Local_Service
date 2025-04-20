// src/Components/ui/dialog.jsx
import * as DialogPrimitive from "@radix-ui/react-dialog";
import React from "react";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogContent = DialogPrimitive.Content;
export const DialogHeader = ({ children }) => <div className="dialog-header">{children}</div>;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogFooter = ({ children }) => <div className="dialog-footer">{children}</div>;
export const DialogClose = DialogPrimitive.Close;
