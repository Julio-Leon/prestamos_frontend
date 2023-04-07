import NEW_CLIENT_PATH from '../../App'
import NEW_PRESTAMO_PATH from '../../App'
import { Link } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ NEW_CLIENT_PATH, NEW_PRESTAMO_PATH }) => {
    return (
        <div className="navbar flex-container">
            <Link to='/'>Home</Link>
            <Link to={NEW_CLIENT_PATH}>New Client</Link>
            <Link to={NEW_PRESTAMO_PATH}>New Prestamo</Link>
        </div>
    )
}

export default Navbar