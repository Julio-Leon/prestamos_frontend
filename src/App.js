import './App.css';
import { useState, useEffect } from 'react';
import ClientCards from './components/DisplayClients/ClientCards';
import PrestamoCards from './components/DisplayClients/PrestamoCards';
import CreateClient from './components/CreateClient/CreateClient';
import CreatePrestamo from './components/CreatePrestamo/CreatePrestamo';
import Clients from './components/Clients/Clients';
import Prestamos from './components/Prestamos/Prestamos';
import Home from './components/Home/Home';
import ConnectionStatus from './components/ConnectionStatus/ConnectionStatus';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Diagnostics from './components/Diagnostics/Diagnostics';
import { Routes, Route } from "react-router-dom";
import PrestamosNavbar from './components/Navbar/PrestamosNavbar';
import API_CONFIG from './config/api';
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
const CLIENTS_PATH = '/clients'
const PRESTAMOS_PATH = '/prestamos'

function App() {

  const [clients, setClients] = useState([])
  const [prestamos, setPrestamos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    return stored === null ? true : stored === 'true'; // Default to dark theme
  });

  // console.log(process.env.REACT_APP_BACKEND_STRING)

  const getClientsInfo = async () => {
    try {
      console.log('Fetching clients from:', API_CONFIG.CLIENTS_URL);
      const response = await fetch(API_CONFIG.CLIENTS_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      console.log('Clients fetched successfully:', data.length, 'clients');
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
      setError(`Failed to load clients: ${error.message}`);
    }
  }

  const getPrestamosInfo = async () => {
    try {
      console.log('Fetching prestamos from:', API_CONFIG.PRESTAMOS_URL);
      const response = await fetch(API_CONFIG.PRESTAMOS_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      console.log('Prestamos data:', data)
      setPrestamos(data)
    } catch (error) {
      console.error('Error fetching prestamos:', error)
      setError(prev => prev ? `${prev}; Failed to load prestamos: ${error.message}` : `Failed to load prestamos: ${error.message}`);
    }
  }

  // Function to refresh all data (for when child components make changes)
  const handleDataChange = async () => {
    console.log('Data change detected, refreshing all data...');
    try {
      await Promise.all([
        getClientsInfo(),
        getPrestamosInfo()
      ]);
      console.log('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      await Promise.all([
        getClientsInfo(),
        getPrestamosInfo()
      ]);
      
      setLoading(false);
    };
    
    loadData();
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', dark);
  }, [dark]);

  if (loading) {
    return (
      <div className={`app modern-app-bg${dark ? ' dark-mode' : ''}`}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.5rem',
          color: 'var(--text-main)'
        }}>
          🔄 Loading application...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`app modern-app-bg${dark ? ' dark-mode' : ''}`}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <div style={{ 
            background: 'var(--error-bg, #fef2f2)',
            border: '1px solid var(--error-border, #fecaca)',
            borderRadius: '8px',
            padding: '20px',
            maxWidth: '600px',
            color: 'var(--error-text, #dc2626)'
          }}>
            <h2>⚠️ Connection Error</h2>
            <p>{error}</p>
            <p>Make sure the backend server is deployed and accessible</p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                background: 'var(--accent-color)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`app modern-app-bg${dark ? ' dark-mode' : ''}`}>
        <DarkModeToggle dark={dark} setDark={setDark} />
        <ConnectionStatus />
        <PrestamosNavbar />
        
        <div className="main-flex-layout">
          <aside className="sidebar-clients">
            <ClientCards clients={clients || []} />
          </aside>
          <main className="main-content">
            <Routes>
              <Route path='/' element={<Home prestamos={prestamos} clients={clients} />} />
              <Route path={CLIENTS_PATH} element={<Clients onDataChange={handleDataChange} />} />
              <Route path={PRESTAMOS_PATH} element={<Prestamos onDataChange={handleDataChange} />} />
              <Route path={NEW_CLIENT_PATH} element={ <CreateClient onDataChange={handleDataChange} />} />
              <Route path={NEW_PRESTAMO_PATH} element={ <CreatePrestamo onDataChange={handleDataChange} />} />
              <Route path='/diagnostics' element={<Diagnostics />} />
            </Routes>
          </main>
          <div className="prestamos-sidebar">
            <PrestamoCards prestamos={prestamos || []} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
