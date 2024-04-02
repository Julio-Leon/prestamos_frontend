const DisplayClients = ({ clients }) => {

    console.log(clients)

    return (
        <div>
            {clients && clients.map(client => {
                return <div key={client.cedula}>
                     {client.firstName} {client.lastName}</div>
            })}
        </div>
    )
}

export default DisplayClients