import { Link } from 'react-router-dom'
import './Home.css'
import DisplayClients from '../DisplayClients/DisplayClients'
import Navbar from '../Navbar/PrestamosNavbar'

const Home = ({ clients, NEW_CLIENT_PATH, NEW_PRESTAMO_PATH, }) => {
    return (
        <div className="home flex-container">
            <div className="show-clients-home">
                <DisplayClients clients={clients} />
            </div>
        </div>
    )
}

export default Home