import { Link } from 'react-router-dom'
import './Home.css'
import DisplayClients from '../DisplayClients/DisplayClients'
import Navbar from '../Navbar/PrestamosNavbar'
import ListGroup from 'react-bootstrap/ListGroup';


const Home = ({ prestamos, clients, NEW_CLIENT_PATH, NEW_PRESTAMO_PATH, }) => {
    return (
        <div className="home flex-container">
            {/* <div className="show-clients-home">
                <DisplayClients clients={clients} />
            </div> */}

            {prestamos && prestamos.map((prestamo) => (
                <ListGroup key='sm' horizontal='sm' className="my-2">
                    <ListGroup.Item>This ListGroup</ListGroup.Item>
                    <ListGroup.Item>renders horizontally</ListGroup.Item>
                    <ListGroup.Item>on </ListGroup.Item>
                    <ListGroup.Item>and above!</ListGroup.Item>
                </ListGroup>
            ))}
        </div>
    )
}

export default Home