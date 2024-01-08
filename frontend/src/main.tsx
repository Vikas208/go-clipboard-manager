import React from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import { routers } from "./router";

const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <RouterProvider router={routers} />
  </React.StrictMode>
);
