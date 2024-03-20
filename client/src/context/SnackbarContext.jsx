import React, { createContext, useContext, useState } from "react";
import { Snackbar } from "@mui/joy";

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("solid");
  const [color, setColor] = useState("danger");

  const triggerSnackbar = ({ message, variant, color }) => {
    setMessage(message);
    if (variant) setVariant(variant);
    if (color) setColor(color);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ triggerSnackbar }}>
      {children}
      <Snackbar
        open={open}
        variant={variant}
        color={color}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        {message}
      </Snackbar>
    </SnackbarContext.Provider>
  );
};
