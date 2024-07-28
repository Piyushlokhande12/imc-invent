import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./Context/auth";
import { SupplierProvider } from "./Context/supplier.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SupplierProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </SupplierProvider>
    </BrowserRouter>
  </React.StrictMode>
);
