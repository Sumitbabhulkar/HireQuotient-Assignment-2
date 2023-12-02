import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import Dashboard from "./Dashboard";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-blue/theme.css";

const App = () => {
  return (
    <PrimeReactProvider>
      <Dashboard />
    </PrimeReactProvider>
  );
};
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
