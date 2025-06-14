import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';

import React from 'react';
import MainLayout from './Layouts/MainLayout';
import HomePage from './Pages/HomePage/HomePage';
import AQI from './Pages/AQI/AQI';
import WQI from './Pages/WQI/WQI';
import LoginPage from './pages/Login/Login';
import Register from './Pages/Register/Register';
import Analytics from './Analytics'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="aqi" element={<AQI />} />
        <Route path="wqi" element={<WQI />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<Register />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}

export default App;
