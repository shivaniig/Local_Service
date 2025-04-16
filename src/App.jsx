import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Components/Dashboard";
import Start from "../src/Main/Start";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
   
  );
};

export default App;
