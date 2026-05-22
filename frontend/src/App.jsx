import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { Route, Routes } from "react-router-dom";
import HowitWorks from "./pages/HowitWork";
import Analyzer from "./pages/Analyzer";

const App = () => {
  return (
    <div className="min-h-screen bg-[#050810] text-white cursor-none overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyzer" element={<Analyzer />} />
        <Route path="/how-it-works" element={<HowitWorks />} />
      </Routes>
    </div>
  );
};

export default App;
