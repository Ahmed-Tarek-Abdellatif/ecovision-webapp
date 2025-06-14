import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Public Components/Navbar";
import Footer from "../Public Components/Footer";


const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <div className="content-wrapper">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
