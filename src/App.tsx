import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import React from "react";
import MainLayout from "./Layouts/MainLayout";
import HomePage from "./Pages/HomePage/HomePage";
import AQI from "./Pages/AQI/AQI";
import WQI from "./Pages/WQI/WQI";
import LoginPage from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} /> {/* Loads at '/' */}
        <Route path="aqi" element={<AQI />} /> {/* Loads at '/aqi' */}
        <Route path="wqi" element={<WQI />} /> {/* Loads at '/wqi' */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<Register />} /> {/* Loads at '/register' */}

      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
