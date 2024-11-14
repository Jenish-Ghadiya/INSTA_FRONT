import React from 'react'
import './App.scss'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import './styles/index.scss';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster/>
    </>
  )
}

export default App
