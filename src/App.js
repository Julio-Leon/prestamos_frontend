import './App.css';
import { useState, useEffect } from 'react'
import DisplayClients from './components/DisplayClients/DisplayClients.js'
import CreateClient from './components/CreateClient/CreateClient';
import CreatePrestamo from './components/CreatePrestamo/CreatePrestamo';
import Home from './components/Home/Home'
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar'


// require('dotenv').config()

const NEW_CLIENT_PATH = '/new-client'
const NEW_PRESTAMO_PATH = '/new-prestamo'
const DISPLAY_CLIENTS = '/display-clients'

function App() {

  const [clients, setClients] = useState(null)

  // console.log(process.env.REACT_APP_BACKEND_STRING)

  const getClientsInfo = async () => {
    const CLIENT_ENDPOINT =  (process.env.REACT_APP_BACKEND_STRING || 'http://localhost:4000/') + 'clients'
    try {
      const response = await fetch(CLIENT_ENDPOINT)
      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getClientsInfo()
  }, [])

  return (
    <div className="app flex-container">
      <Navbar NEW_CLIENT_PATH={NEW_CLIENT_PATH} NEW_PRESTAMO_PATH={NEW_PRESTAMO_PATH} />
      <Routes>
        <Route path='/' element={<Home clients={clients} NEW_CLIENT_PATH={NEW_CLIENT_PATH} NEW_PRESTAMO_PATH={NEW_PRESTAMO_PATH} DISPLAY_CLIENTS={DISPLAY_CLIENTS} />} />
        <Route path={NEW_CLIENT_PATH} element={ <CreateClient />} />
        <Route path={NEW_PRESTAMO_PATH} element={ <CreatePrestamo />} />
      </Routes>
    </div>
  );
}

export default App;
