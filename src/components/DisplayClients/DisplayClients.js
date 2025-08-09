const DisplayClients = ({ clients }) => {
    return (
        <div className="display-clients-container">
            <h2 className="clients-title">Clientes</h2>
            <div className="clients-list">
                {clients && clients.map(client => (
                    <div className="client-item" key={client.cedula}>
                        <span className="client-name">{client.firstName} {client.lastName}</span>
                        <span className="client-cedula">Cédula: {client.cedula}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DisplayClients