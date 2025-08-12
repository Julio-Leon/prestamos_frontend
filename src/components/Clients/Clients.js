import React, { useState, useEffect } from 'react';
import './Clients.css';

const Clients = ({ onDataChange }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('firstName');
  const [backendStatus, setBackendStatus] = useState('unknown');

  // Notify parent component when data changes
  const notifyDataChange = () => {
    if (onDataChange && typeof onDataChange === 'function') {
      console.log('Notifying parent component of data change...');
      onDataChange();
    }
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      setBackendStatus('testing');
      const response = await fetch('http://localhost:4000/health');
      if (response.ok) {
        const data = await response.json();
        console.log('Backend health check:', data);
        setBackendStatus('connected');
        alert(`Local backend is healthy! Status: ${data.status}, Uptime: ${Math.round(data.uptime)}s`);
      } else {
        setBackendStatus('error');
        alert(`Backend health check failed: ${response.status}`);
      }
    } catch (error) {
      setBackendStatus('error');
      console.error('Backend connection test failed:', error);
      alert(`Backend connection test failed: ${error.message}`);
    }
  };

  // Fetch all clients
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      // Temporarily using local backend for testing
      const response = await fetch('http://localhost:4000/clients');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Edit client
  const handleEdit = (client) => {
    setEditingClient({ 
      ...client,
      address: {
        street: client.address?.street || '',
        number: client.address?.number || '',
        apartment: client.address?.apartment || '',
        county: client.address?.county || '',
        state: client.address?.state || '',
        zipCode: client.address?.zipCode || ''
      }
    });
  };

  const handleSaveEdit = async () => {
    try {
      // Prepare the data in the format expected by the backend
      const updateData = {
        cedula: editingClient.cedula,
        firstName: editingClient.firstName,
        lastName: editingClient.lastName,
        department: editingClient.department,
        telephoneNumber: editingClient.telephoneNumber,
        celularNumber: editingClient.celularNumber,
        // Flatten address fields for backend compatibility
        street: editingClient.address?.street,
        number: editingClient.address?.number,
        apartment: editingClient.address?.apartment,
        county: editingClient.address?.county,
        state: editingClient.address?.state,
        zipCode: editingClient.address?.zipCode,
        recommendedBy: editingClient.recommendedBy
      };

      console.log('Updating client with data:', updateData);

      const response = await fetch(`http://localhost:4000/clients/${editingClient.cedula}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClients(clients.map(client => 
          client.cedula === editingClient.cedula ? updatedClient : client
        ));
        setEditingClient(null);
        console.log('Client updated successfully');
        
        // Notify parent component to update sidebars
        notifyDataChange();
      } else {
        const errorData = await response.text();
        console.error('Error updating client:', response.status, errorData);
        alert(`Error updating client: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert(`Network error updating client: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  // Delete client
  const handleDelete = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Deleting client with cedula:', clientToDelete.cedula);

      const response = await fetch(`http://localhost:4000/clients/${clientToDelete.cedula}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Client deleted successfully:', result);
        setClients(clients.filter(client => client.cedula !== clientToDelete.cedula));
        setShowDeleteModal(false);
        setClientToDelete(null);
        
        // Notify parent component to update sidebars
        notifyDataChange();
        alert('Cliente eliminado exitosamente');
      } else {
        let errorMessage;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || `Error ${response.status}`;
          console.error('JSON error response:', errorData);
        } else {
          const errorText = await response.text();
          errorMessage = `Server error (${response.status}): ${errorText.substring(0, 200)}...`;
          console.error('HTML error response:', errorText);
        }
        
        alert(`Error deleting client: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network error deleting client:', error);
      alert(`Network error deleting client: ${error.message}\n\nPlease check if the backend is running and accessible.`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  // Filter and sort clients
  const filteredClients = clients
    .filter(client => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase()) || 
             client.cedula.includes(searchTerm) ||
             (client.department && client.department.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a, b) => {
      if (sortBy === 'firstName') {
        return a.firstName.localeCompare(b.firstName);
      } else if (sortBy === 'lastName') {
        return a.lastName.localeCompare(b.lastName);
      } else if (sortBy === 'cedula') {
        return a.cedula.localeCompare(b.cedula);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="clients-container">
        <div className="loader">
          <p>Cargando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="clients-container">
      <div className="clients-header">
        <h1 className="clients-title">Gestión de Clientes</h1>
        <p className="clients-subtitle">Administra todos los clientes del sistema</p>
        <button 
          onClick={testBackendConnection} 
          className={`test-backend-btn ${backendStatus}`}
          disabled={backendStatus === 'testing'}
        >
          {backendStatus === 'testing' ? '🔄 Testing...' : 
           backendStatus === 'connected' ? '✅ Backend OK' : 
           backendStatus === 'error' ? '❌ Backend Error' : 
           '🔍 Test Backend'}
        </button>
      </div>

      {/* Search and Sort Controls */}
      <div className="clients-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por nombre, cédula o institución..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="sort-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="firstName">Ordenar por Nombre</option>
            <option value="lastName">Ordenar por Apellido</option>
            <option value="cedula">Ordenar por Cédula</option>
          </select>
        </div>
      </div>

      {/* Clients Count */}
      <div className="clients-stats">
        <span className="clients-count">
          {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} encontrado{filteredClients.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Clients Grid */}
      <div className="clients-grid">
        {filteredClients.map((client) => (
          <div key={client.cedula} className="client-card">
            {editingClient && editingClient.cedula === client.cedula ? (
              // Edit Mode
              <div className="client-edit-form">
                <div className="edit-form-row">
                  <input
                    type="text"
                    value={editingClient.firstName}
                    onChange={(e) => setEditingClient({...editingClient, firstName: e.target.value})}
                    className="edit-input"
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    value={editingClient.lastName}
                    onChange={(e) => setEditingClient({...editingClient, lastName: e.target.value})}
                    className="edit-input"
                    placeholder="Apellido"
                  />
                </div>
                <input
                  type="text"
                  value={editingClient.cedula}
                  onChange={(e) => setEditingClient({...editingClient, cedula: e.target.value})}
                  className="edit-input"
                  placeholder="Cédula"
                  disabled
                />
                <input
                  type="tel"
                  value={editingClient.telephoneNumber || ''}
                  onChange={(e) => setEditingClient({...editingClient, telephoneNumber: e.target.value})}
                  className="edit-input"
                  placeholder="Teléfono"
                />
                <input
                  type="tel"
                  value={editingClient.celularNumber || ''}
                  onChange={(e) => setEditingClient({...editingClient, celularNumber: e.target.value})}
                  className="edit-input"
                  placeholder="Celular"
                />
                <input
                  type="text"
                  value={editingClient.department || ''}
                  onChange={(e) => setEditingClient({...editingClient, department: e.target.value})}
                  className="edit-input"
                  placeholder="Institución"
                />
                <div className="edit-form-row">
                  <input
                    type="text"
                    value={editingClient.address?.street || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient, 
                      address: {
                        ...editingClient.address,
                        street: e.target.value
                      }
                    })}
                    className="edit-input"
                    placeholder="Calle"
                  />
                  <input
                    type="text"
                    value={editingClient.address?.number || ''}
                    onChange={(e) => setEditingClient({
                      ...editingClient,
                      address: {
                        ...editingClient.address,
                        number: e.target.value
                      }
                    })}
                    className="edit-input"
                    placeholder="Número"
                  />
                </div>
                <input
                  type="text"
                  value={editingClient.address?.apartment || ''}
                  onChange={(e) => setEditingClient({
                    ...editingClient,
                    address: {
                      ...editingClient.address,
                      apartment: e.target.value
                    }
                  })}
                  className="edit-input"
                  placeholder="Apartamento"
                />
                <textarea
                  value={editingClient.recommendedBy || ''}
                  onChange={(e) => setEditingClient({...editingClient, recommendedBy: e.target.value})}
                  className="edit-textarea"
                  placeholder="Recomendación"
                  rows="2"
                />
                <div className="edit-actions">
                  <button onClick={handleSaveEdit} className="save-btn">Guardar</button>
                  <button onClick={handleCancelEdit} className="cancel-btn">Cancelar</button>
                </div>
              </div>
            ) : (
              // View Mode
              <>
                <div className="client-card-header">
                  <div className="client-name">
                    {client.firstName} {client.lastName}
                  </div>
                  <div className="client-actions">
                    <button onClick={() => handleEdit(client)} className="edit-btn" title="Editar">
                      ✏️
                    </button>
                    <button onClick={() => handleDelete(client)} className="delete-btn" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="client-card-body">
                  <div className="client-detail">
                    <strong>Cédula:</strong> {client.cedula}
                  </div>
                  {client.telephoneNumber && (
                    <div className="client-detail">
                      <strong>Teléfono:</strong> {client.telephoneNumber}
                    </div>
                  )}
                  {client.celularNumber && (
                    <div className="client-detail">
                      <strong>Celular:</strong> {client.celularNumber}
                    </div>
                  )}
                  {client.department && (
                    <div className="client-detail">
                      <strong>Institución:</strong> {client.department}
                    </div>
                  )}
                  {(client.address?.street || client.address?.number || client.address?.apartment) && (
                    <div className="client-detail">
                      <strong>Dirección:</strong> {client.address?.street} {client.address?.number} {client.address?.apartment ? `Apt. ${client.address.apartment}` : ''}
                    </div>
                  )}
                  {client.recommendedBy && (
                    <div className="client-detail recommendation">
                      <strong>Recomendación:</strong> {client.recommendedBy}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && !loading && (
        <div className="no-clients">
          <div className="no-clients-icon">👥</div>
          <h3>No se encontraron clientes</h3>
          <p>No hay clientes que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Confirmar eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que deseas eliminar al cliente:</p>
              <p className="client-to-delete">
                <strong>{clientToDelete?.firstName} {clientToDelete?.lastName}</strong>
              </p>
              <p className="delete-warning">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="confirm-delete-btn">
                Eliminar
              </button>
              <button onClick={cancelDelete} className="cancel-delete-btn">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
