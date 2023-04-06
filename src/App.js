import './App.css';
import { useState, useEffect } from 'react'
import DisplayClients from './components/DisplayClients/DisplayClients.js'
import CreateClient from './components/CreateClient/CreateClient';
// require('dotenv').config()

function App() {

  const [clients, setClients] = useState(null)

  console.log(process.env.REACT_APP_BACKEND_STRING)

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
      <CreateClient />
      <DisplayClients clients={clients} />
    </div>
  );
}

export default App;
