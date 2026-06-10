import React from "react";
import ReactDOM from "react-dom/client";
import ParentApp from "./ParentApp.jsx";
import '@tonyarbor/tokens/css';
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ParentApp />
  </React.StrictMode>
);

