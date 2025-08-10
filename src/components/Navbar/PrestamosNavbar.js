import { Link } from 'react-router-dom';
import './Navbar.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const PrestamosNavbar = () => {
    const NEW_CLIENT_PATH = '/new-client';
    const NEW_PRESTAMO_PATH = '/new-prestamo';
    const CLIENTS_PATH = '/clients';
    const PRESTAMOS_PATH = '/prestamos';
    const displayMyNavbar = false;

    return displayMyNavbar ? (
        <nav className="navbar modern-navbar">
            <Link className="nav-link" to='/'>Home</Link>
            <Link className="nav-link" to={CLIENTS_PATH}>Clientes</Link>
            <Link className="nav-link" to={PRESTAMOS_PATH}>Préstamos</Link>
            <Link className="nav-link" to={NEW_CLIENT_PATH}>Nuevo Cliente</Link>
            <Link className="nav-link" to={NEW_PRESTAMO_PATH}>Nuevo Préstamo</Link>
        </nav>
    ) : (
        <Navbar expand="lg" className="navbar modern-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/">Préstamos León</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to={CLIENTS_PATH}>Clientes</Nav.Link>
                        <Nav.Link as={Link} to={PRESTAMOS_PATH}>Préstamos</Nav.Link>
                        <Nav.Link as={Link} to={NEW_CLIENT_PATH}>Nuevo Cliente</Nav.Link>
                        <Nav.Link as={Link} to={NEW_PRESTAMO_PATH}>Nuevo Préstamo</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default PrestamosNavbar