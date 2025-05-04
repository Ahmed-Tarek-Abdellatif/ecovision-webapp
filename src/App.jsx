import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import React from "react";
import MainLayout from "./Layouts/MainLayout";
import HomePage from "./pages/HomePage";
import AQI from "./pages/AQI";
import WQI from "./pages/WQI";
import LoginPage from "./pages/LoginPage"; // <-- 1. Import LoginPage here

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} /> {/* Loads at '/' */}
        <Route path="aqi" element={<AQI />} /> {/* Loads at '/aqi' */}
        <Route path="wqi" element={<WQI />} /> {/* Loads at '/wqi' */}
        <Route path="login" element={<LoginPage />} /> {/* Loads at '/login' */}
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
