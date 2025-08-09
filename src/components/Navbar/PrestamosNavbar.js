import NEW_CLIENT_PATH from '../../App'
import NEW_PRESTAMO_PATH from '../../App'
import { Link } from 'react-router-dom'
import './Navbar.css'

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const PrestamosNavbar = ({ NEW_CLIENT_PATH, NEW_PRESTAMO_PATH }) => {

    const displayMyNavbar = false

    return displayMyNavbar ? (
        <nav className="navbar modern-navbar">
            <Link className="nav-link" to='/'>Home</Link>
            <Link className="nav-link" to={NEW_CLIENT_PATH}>Nuevo Cliente</Link>
            <Link className="nav-link" to={NEW_PRESTAMO_PATH}>Nuevo Préstamo</Link>
        </nav>
    ) : (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="navbar modern-navbar bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">Préstamos León</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href='/'>Home</Nav.Link>
                        <Nav.Link href={NEW_CLIENT_PATH}>Nuevo Cliente</Nav.Link>
                        <Nav.Link href={NEW_PRESTAMO_PATH}>Nuevo Préstamo</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default PrestamosNavbar