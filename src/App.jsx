import {
  Route, 
  createBrowserRouter,
  createRoutesFromElements, 
  RouterProvider
} from 'react-router-dom'

import React from 'react'
import MainLayout from './Layouts/MainLayout'
import HomePage from './pages/HomePage'


function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path='/' element= {<MainLayout />}>
      <Route index element={<HomePage/>} />
    </Route>
    )
  )
  return <RouterProvider router = {router}/>
  
}

export default App
