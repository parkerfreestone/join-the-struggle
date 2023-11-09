import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";

import { NextUIProvider } from "@nextui-org/react";
import { SupabaseProvider } from "./context/SupabaseContext.tsx";
import { ToastContainer } from "react-toastify";

import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SupabaseProvider>
      <ThemeProvider>
        <NextUIProvider>
          <App />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            closeOnClick
          ></ToastContainer>
        </NextUIProvider>
      </ThemeProvider>
    </SupabaseProvider>
  </React.StrictMode>
);
