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



// Dark mode toggle button
function DarkModeToggle({ dark, setDark }) {
  return (
    <button
      className="darkmode-toggle-btn"
      onClick={() => setDark(d => !d)}
      style={{
        position: 'fixed',
        top: 18,
        right: 24,
        zIndex: 1000,
        background: dark ? 'linear-gradient(135deg, #232526 0%, #18191a 100%)' : 'linear-gradient(135deg, #ededed 0%, #f9f9f9 100%)',
        color: dark ? '#f1f1f1' : '#222',
        border: 'none',
        borderRadius: '2rem',
        boxShadow: '0 2px 12px 0 rgba(80,80,80,0.10)',
        padding: '0.5rem 1.2rem',
        fontWeight: 600,
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background 0.3s, color 0.3s',
      }}
      aria-label="Toggle dark mode"
    >
      {dark ? '☾ Dark' : '☀ Light'}
    </button>
  );
}




// require('dotenv').config()

const NEW_CLIENT_PATH = '/new-client'
const NEW_PRESTAMO_PATH = '/new-prestamo'
const DISPLAY_CLIENTS = '/display-clients'

function App() {

  const [clients, setClients] = useState(null)
  const [prestamos, setPrestamos] = useState(null)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored === null ? true : stored === 'true'; // Default to dark theme
  });

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

  useEffect(() => {
    localStorage.setItem('darkMode', dark);
  }, [dark]);

  return (
    <div className={`app modern-app-bg${dark ? ' dark-mode' : ''}`}>
      <DarkModeToggle dark={dark} setDark={setDark} />
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
