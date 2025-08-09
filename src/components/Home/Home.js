import './Home.css';



const Home = ({ prestamos, clients }) => {
    return (
        <div className="home modern-home-bg">
            <h2 className="home-title">Bienvenido a Préstamos León</h2>
            <div className="clients-count">Clientes en la base de datos: <strong>{clients ? clients.length : 0}</strong></div>
            <div className="prestamos-count">Préstamos en la base de datos: <strong>{prestamos ? prestamos.length : 0}</strong></div>
        </div>
    )
}

export default Home;