import './App.css';
import { useState, useEffect } from 'react'
import DisplayClients from './components/DisplayClients/DisplayClients.js'
import ClientCards from './components/DisplayClients/ClientCards';
import PrestamoCards from './components/DisplayClients/PrestamoCards';
import CreateClient from './components/CreateClient/CreateClient';
import CreatePrestamo from './components/CreatePrestamo/CreatePrestamo';
import Home from './components/Home/Home'
import { Routes, Route } from "react-router-dom";
import PrestamosNavbar from './components/Navbar/PrestamosNavbar'
import 'bootstrap/dist/css/bootstrap.min.css';




// require('dotenv').config()

const NEW_CLIENT_PATH = '/new-client'
const NEW_PRESTAMO_PATH = '/new-prestamo'
const DISPLAY_CLIENTS = '/display-clients'

function App() {

  const [clients, setClients] = useState(null)
  const [prestamos, setPrestamos] = useState(null)

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

  const getPrestamosInfo = async () => {
    const PRESTAMOS_ENDPOINT = (process.env.REACT_APP_BACKEND_STRING || 'http://localhost:4000/') + 'prestamos'
    try {
      const response = await fetch(PRESTAMOS_ENDPOINT)
      const data = await response.json()
      console.log(data)
      setPrestamos(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getClientsInfo()
    getPrestamosInfo()
  }, [])

  return (
    <div className="app modern-app-bg">
      <PrestamosNavbar NEW_CLIENT_PATH={NEW_CLIENT_PATH} NEW_PRESTAMO_PATH={NEW_PRESTAMO_PATH} />
      <div className="main-flex-layout">
        <aside className="sidebar-clients">
          <ClientCards clients={clients || []} />
        </aside>
        <main className="main-content">
          <Routes>
            <Route path='/' element={<Home prestamos={prestamos} clients={clients} />} />
            <Route path={NEW_CLIENT_PATH} element={ <CreateClient />} />
            <Route path={NEW_PRESTAMO_PATH} element={ <CreatePrestamo />} />
          </Routes>
        </main>
        <div className="prestamos-sidebar">
          <PrestamoCards prestamos={prestamos || []} />
        </div>
      </div>
    </div>
  );
}

export default App;
