import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Main/Dashboard";
import Start from "../src/Components/Start";
import LoginSignup from "./Components/LoginSignup";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<LoginSignup />} /> {/* Add route for LoginSignup */}
        <Route path="/dash" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
