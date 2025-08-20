import React, { useState, useEffect } from 'react';
import './Prestamos.css';
import API_CONFIG from '../../config/api';

const Prestamos = ({ onDataChange }) => {
  const [prestamos, setPrestamos] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrestamo, setEditingPrestamo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [prestamoToDelete, setPrestamoToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('startDate');
  const [filterStatus, setFilterStatus] = useState('all'); // all, active, completed
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [paymentData, setPaymentData] = useState({
    capitalPayment: 0,
    interestPayment: 0
  });

  // Notify parent component when data changes
  const notifyDataChange = () => {
    if (onDataChange && typeof onDataChange === 'function') {
      console.log('Notifying parent component of data change...');
      onDataChange();
    }
  };

  // Fetch all prestamos and clients
  useEffect(() => {
    fetchPrestamos();
    fetchClients();
  }, []);

  const fetchPrestamos = async () => {
    try {
      setLoading(true);
      console.log('Fetching prestamos from:', API_CONFIG.PRESTAMOS_URL);
      const response = await fetch(API_CONFIG.PRESTAMOS_URL);
      if (response.ok) {
        const data = await response.json();
        setPrestamos(data);
        console.log('Fetched prestamos:', data.length);
      } else {
        console.error('Error fetching prestamos:', response.status);
        const errorText = await response.text();
        console.error('Error details:', errorText);
      }
    } catch (error) {
      console.error('Network error fetching prestamos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      console.log('Fetching clients from:', API_CONFIG.CLIENTS_URL);
      const response = await fetch(API_CONFIG.CLIENTS_URL);
      if (response.ok) {
        const data = await response.json();
        setClients(data);
        console.log('Fetched clients:', data.length);
      } else {
        console.error('Error fetching clients:', response.status);
      }
    } catch (error) {
      console.error('Network error fetching clients:', error);
    }
  };

  // Get client info by cedula
  const getClientInfo = (cedula) => {
    return clients.find(client => client.cedula === cedula) || { firstName: 'Desconocido', lastName: '' };
  };

  // Calculate loan status
  const getLoanStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'Pendiente';
    if (now > end) return 'Completado';
    return 'Activo';
  };

  // Edit prestamo
  const handleEdit = (prestamo) => {
    setEditingPrestamo({ ...prestamo });
  };

  // Interest rates (annual rates) - same as in CreatePrestamo component
  const INTEREST_RATES = {
    'Monthly': 0.12,    // 12% annual for monthly payments
    'Bi-Weekly': 0.10,  // 10% annual for bi-weekly payments (quincenal)
    'Weekly': 0.05      // 5% annual for weekly payments (semanal)
  };

  // Calculate loan details (similar to CreatePrestamo's calculateLoanDetails)
  const calculateLoanDetails = (principal, annualRate, totalPayments, paymentFrequency) => {
    if (!principal || !annualRate || !totalPayments) return null;
    
    // Convert annual rate to payment period rate
    const paymentsPerYear = paymentFrequency === 'Bi-Weekly' ? 26 : 
                           paymentFrequency === 'Monthly' ? 12 : 52; // 26 for bi-weekly, 12 for monthly, 52 for weekly
    const periodRate = annualRate / paymentsPerYear;
    
    // Calculate payment amount using amortization formula
    // PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
    const numerator = periodRate * Math.pow(1 + periodRate, totalPayments);
    const denominator = Math.pow(1 + periodRate, totalPayments) - 1;
    const paymentAmount = principal * (numerator / denominator);
    
    // Calculate totals
    const totalToPay = paymentAmount * totalPayments;
    const totalInterest = totalToPay - principal;
    
    return {
      amountPerPayment: Math.round(paymentAmount * 100) / 100, // Round to 2 decimals
      totalToPay: Math.round(totalToPay * 100) / 100,
      interestEarn: Math.round(totalInterest * 100) / 100
    };
  };

  const handleSaveEdit = async () => {
    try {
      // Recalculate loan details if amount of payments or loan amount changed
      const principal = parseFloat(editingPrestamo.prestamoAmount);
      const payments = parseInt(editingPrestamo.amountOfPayments);
      
      // Get the appropriate interest rate
      const annualRate = INTEREST_RATES[editingPrestamo.paymentSchedule] || 0.10; // Default to 10% if not found
      
      // Recalculate the loan details
      const recalculated = calculateLoanDetails(
        principal, 
        annualRate, 
        payments, 
        editingPrestamo.paymentSchedule
      );
      
      // Use recalculated values
      const updateData = {
        cedula: editingPrestamo.cedula,
        paymentSchedule: editingPrestamo.paymentSchedule,
        prestamoAmount: principal,
        startDate: editingPrestamo.startDate,
        endDate: editingPrestamo.endDate,
        totalToPay: recalculated ? recalculated.totalToPay : parseFloat(editingPrestamo.totalToPay),
        interestEarn: recalculated ? recalculated.interestEarn : parseFloat(editingPrestamo.interestEarn),
        interestToPay: parseFloat(editingPrestamo.interestToPay || editingPrestamo.interestEarn),
        capitalRemaining: parseFloat(editingPrestamo.capitalRemaining || editingPrestamo.prestamoAmount),
        amountOfPayments: payments,
        amountPerPayment: recalculated ? recalculated.amountPerPayment : parseFloat(editingPrestamo.amountPerPayment),
        paymentsMade: parseInt(editingPrestamo.paymentsMade || 0),
        status: editingPrestamo.status || 'active'
      };

      console.log('Updating prestamo with data:', updateData);

      const response = await fetch(`${API_CONFIG.PRESTAMOS_URL}/${editingPrestamo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedPrestamo = await response.json();
        setPrestamos(prestamos.map(prestamo => 
          prestamo._id === editingPrestamo._id ? updatedPrestamo : prestamo
        ));
        setEditingPrestamo(null);
        console.log('Prestamo updated successfully');
        
        // Notify parent component to update sidebars
        notifyDataChange();
        alert('Préstamo actualizado exitosamente');
      } else {
        const errorData = await response.text();
        console.error('Error updating prestamo:', response.status, errorData);
        alert(`Error updating prestamo: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Network error updating prestamo:', error);
      alert(`Network error updating prestamo: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingPrestamo(null);
  };

  // Delete prestamo
  const handleDelete = (prestamo) => {
    setPrestamoToDelete(prestamo);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      console.log('Deleting prestamo with ID:', prestamoToDelete._id);

      const response = await fetch(`${API_CONFIG.PRESTAMOS_URL}/${prestamoToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Prestamo deleted successfully:', result);
        setPrestamos(prestamos.filter(prestamo => prestamo._id !== prestamoToDelete._id));
        setShowDeleteModal(false);
        setPrestamoToDelete(null);
        
        // Notify parent component to update sidebars
        notifyDataChange();
        alert('Préstamo eliminado exitosamente');
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
        
        alert(`Error deleting prestamo: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network error deleting prestamo:', error);
      alert(`Network error deleting prestamo: ${error.message}\n\nPlease check if the backend is running and accessible.`);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPrestamoToDelete(null);
  };

  // Payment functions
  const handleAddPayment = (prestamo) => {
    setSelectedPrestamo(prestamo);
    
    // Calculate default payment amounts
    const amountPerPayment = prestamo.amountPerPayment || 0;
    // const totalToPay = prestamo.totalToPay || 0;
    const prestamoAmount = prestamo.prestamoAmount || 0;
    const interestEarn = prestamo.interestEarn || 0;
    
    // Simple calculation: interest portion vs capital portion
    const interestRate = interestEarn / prestamoAmount; // Total interest rate
    const interestPayment = amountPerPayment * (interestRate / (1 + interestRate));
    const capitalPayment = amountPerPayment - interestPayment;
    
    setPaymentData({
      capitalPayment: Math.round(capitalPayment * 100) / 100,
      interestPayment: Math.round(interestPayment * 100) / 100
    });
    
    setShowPaymentModal(true);
  };

  const handlePaymentDataChange = (field, value) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handlePaymentSubmit = async () => {
    try {
      // Here you would typically send the payment data to your backend
      console.log('Processing payment for prestamo:', selectedPrestamo._id);
      console.log('Payment data:', paymentData);
      
      // For now, just show a success message
      alert(`Pago procesado exitosamente:\nCapital: $${paymentData.capitalPayment}\nIntereses: $${paymentData.interestPayment}`);
      
      // Close modal and refresh data
      setShowPaymentModal(false);
      setSelectedPrestamo(null);
      setPaymentData({ capitalPayment: 0, interestPayment: 0 });
      
      // Refresh prestamos data
      notifyDataChange();
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(`Error procesando el pago: ${error.message}`);
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setSelectedPrestamo(null);
    setPaymentData({ capitalPayment: 0, interestPayment: 0 });
  };

  // Filter and sort prestamos
  const getFilteredAndSortedPrestamos = () => {
    let filtered = prestamos.filter(prestamo => {
      const client = getClientInfo(prestamo.cedula);
      const clientName = `${client.firstName} ${client.lastName}`.toLowerCase();
      const cedula = prestamo.cedula.toLowerCase();
      const amount = prestamo.prestamoAmount.toString();
      
      const matchesSearch = clientName.includes(searchTerm.toLowerCase()) ||
                          cedula.includes(searchTerm.toLowerCase()) ||
                          amount.includes(searchTerm);

      if (!matchesSearch) return false;

      // Filter by status
      if (filterStatus !== 'all') {
        const status = getLoanStatus(prestamo.startDate, prestamo.endDate).toLowerCase();
        if (filterStatus === 'active' && status !== 'activo') return false;
        if (filterStatus === 'completed' && status !== 'completado') return false;
        if (filterStatus === 'pending' && status !== 'pendiente') return false;
      }

      return true;
    });

    // Sort prestamos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(b.startDate) - new Date(a.startDate);
        case 'endDate':
          return new Date(a.endDate) - new Date(b.endDate);
        case 'amount':
          return b.prestamoAmount - a.prestamoAmount;
        case 'client':
          const clientA = getClientInfo(a.cedula);
          const clientB = getClientInfo(b.cedula);
          return `${clientA.firstName} ${clientA.lastName}`.localeCompare(`${clientB.firstName} ${clientB.lastName}`);
        case 'cedula':
          return a.cedula.localeCompare(b.cedula);
        default:
          return 0;
      }
    });

    return filtered;
  };

  if (loading) {
    return (
      <div className="prestamos-container modern-bg">
        <div className="loading-spinner">
          <span>Cargando préstamos...</span>
        </div>
      </div>
    );
  }

  const filteredPrestamos = getFilteredAndSortedPrestamos();

  return (
    <div className="prestamos-container modern-bg">
      <div className="prestamos-header">
        <h1 className="prestamos-title">Gestión de Préstamos</h1>
        <p className="prestamos-subtitle">
          Administre todos los préstamos del sistema ({prestamos.length} préstamos)
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="prestamos-controls">
        <div className="search-container">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por cliente, cédula o monto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="filter-sort-container">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los Estados</option>
            <option value="active">Activos</option>
            <option value="completed">Completados</option>
            <option value="pending">Pendientes</option>
          </select>

          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="startDate">Fecha de Inicio</option>
            <option value="endDate">Fecha de Fin</option>
            <option value="amount">Monto</option>
            <option value="client">Cliente</option>
            <option value="cedula">Cédula</option>
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="results-summary">
        Mostrando {filteredPrestamos.length} de {prestamos.length} préstamos
      </div>

      {/* Prestamos Grid */}
      <div className="prestamos-grid">
        {filteredPrestamos.length === 0 ? (
          <div className="no-prestamos">
            <div className="no-prestamos-icon">💳</div>
            <h3>No se encontraron préstamos</h3>
            <p>
              {searchTerm || filterStatus !== 'all' 
                ? 'Intente ajustar los filtros de búsqueda'
                : 'No hay préstamos registrados en el sistema'
              }
            </p>
          </div>
        ) : (
          filteredPrestamos.map((prestamo) => {
            const client = getClientInfo(prestamo.cedula);
            const status = getLoanStatus(prestamo.startDate, prestamo.endDate);
            const isEditing = editingPrestamo && editingPrestamo._id === prestamo._id;

            return (
              <div key={prestamo._id} className={`prestamo-card ${status.toLowerCase()}`}>
                {isEditing ? (
                  // Edit Mode
                  <div className="prestamo-edit-form">
                    <div className="edit-header">
                      <h3>Editar Préstamo</h3>
                      <div className="edit-actions">
                        <button className="save-btn" onClick={handleSaveEdit}>
                          ✅ Guardar
                        </button>
                        <button className="cancel-btn" onClick={handleCancelEdit}>
                          ❌ Cancelar
                        </button>
                      </div>
                    </div>

                    <div className="edit-grid">
                      <div className="edit-field">
                        <label>Cédula:</label>
                        <input
                          type="text"
                          value={editingPrestamo.cedula}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            cedula: e.target.value
                          })}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Frecuencia:</label>
                        <select
                          value={editingPrestamo.paymentSchedule}
                          onChange={(e) => {
                            const newSchedule = e.target.value;
                            // Get current values
                            const principal = parseFloat(editingPrestamo.prestamoAmount);
                            const payments = parseInt(editingPrestamo.amountOfPayments);
                            const annualRate = INTEREST_RATES[newSchedule] || 0.10; // Default to 10% if not found
                            
                            // Recalculate loan details
                            const recalculated = calculateLoanDetails(
                              principal, 
                              annualRate, 
                              payments, 
                              newSchedule
                            );
                            
                            // Update with new values
                            setEditingPrestamo({
                              ...editingPrestamo,
                              paymentSchedule: newSchedule,
                              // Update other values only if recalculation was successful
                              ...(recalculated && {
                                amountPerPayment: recalculated.amountPerPayment,
                                totalToPay: recalculated.totalToPay,
                                interestEarn: recalculated.interestEarn
                              })
                            });
                          }}
                        >
                          <option value="Monthly">Mensual</option>
                          <option value="Bi-Weekly">Quincenal</option>
                        </select>
                      </div>

                      <div className="edit-field">
                        <label>Monto:</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPrestamo.prestamoAmount}
                          onChange={(e) => {
                            const newAmount = e.target.value;
                            // Get current values
                            const payments = parseInt(editingPrestamo.amountOfPayments);
                            const paymentSchedule = editingPrestamo.paymentSchedule;
                            const annualRate = INTEREST_RATES[paymentSchedule] || 0.10; // Default to 10% if not found
                            
                            // Recalculate loan details
                            const recalculated = calculateLoanDetails(
                              parseFloat(newAmount), 
                              annualRate, 
                              payments, 
                              paymentSchedule
                            );
                            
                            // Update with new values
                            setEditingPrestamo({
                              ...editingPrestamo,
                              prestamoAmount: newAmount,
                              // Update other values only if recalculation was successful
                              ...(recalculated && {
                                amountPerPayment: recalculated.amountPerPayment,
                                totalToPay: recalculated.totalToPay,
                                interestEarn: recalculated.interestEarn
                              })
                            });
                          }}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Total a Pagar:</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPrestamo.totalToPay}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            totalToPay: e.target.value
                          })}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Intereses:</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPrestamo.interestEarn}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            interestEarn: e.target.value
                          })}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Intereses a Pagar:</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPrestamo.interestEarn}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            interestEarn: e.target.value
                          })}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Número de Pagos:</label>
                        <input
                          type="number"
                          value={editingPrestamo.amountOfPayments}
                          onChange={(e) => {
                            const newPayments = e.target.value;
                            // Get current values
                            const principal = parseFloat(editingPrestamo.prestamoAmount);
                            const paymentSchedule = editingPrestamo.paymentSchedule;
                            const annualRate = INTEREST_RATES[paymentSchedule] || 0.10; // Default to 10% if not found
                            
                            // Recalculate loan details
                            const recalculated = calculateLoanDetails(
                              principal, 
                              annualRate, 
                              parseInt(newPayments), 
                              paymentSchedule
                            );
                            
                            // Update with new values
                            setEditingPrestamo({
                              ...editingPrestamo,
                              amountOfPayments: newPayments,
                              // Update other values only if recalculation was successful
                              ...(recalculated && {
                                amountPerPayment: recalculated.amountPerPayment,
                                totalToPay: recalculated.totalToPay,
                                interestEarn: recalculated.interestEarn
                              })
                            });
                          }}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Pago por Período:</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPrestamo.amountPerPayment}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            amountPerPayment: e.target.value
                          })}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Fecha de Inicio:</label>
                        <input
                          type="date"
                          value={editingPrestamo.startDate}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            startDate: e.target.value
                          })}
                        />
                      </div>

                      <div className="edit-field">
                        <label>Fecha de Fin:</label>
                        <input
                          type="date"
                          value={editingPrestamo.endDate}
                          onChange={(e) => setEditingPrestamo({
                            ...editingPrestamo,
                            endDate: e.target.value
                          })}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="prestamo-header">
                      <div className="prestamo-status">
                        <span className={`status-badge ${status.toLowerCase()}`}>
                          {status}
                        </span>
                      </div>
                      <div className="prestamo-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(prestamo)}
                          title="Editar préstamo"
                        >
                          ✏️
                        </button>
                        <button
                          className="payment-btn"
                          onClick={() => handleAddPayment(prestamo)}
                          title="Agregar pago"
                        >
                          💰
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(prestamo)}
                          title="Eliminar préstamo"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="prestamo-client">
                      <h3 className="client-name">
                        {client.firstName} {client.lastName}
                      </h3>
                      <p className="client-cedula">Cédula: {prestamo.cedula}</p>
                    </div>

                    <div className="prestamo-amounts">
                      <div className="amount-item">
                        <span className="amount-label">Monto Préstamo:</span>
                        <span className="amount-value">${prestamo.prestamoAmount}</span>
                      </div>
                      <div className="amount-item main-amount">
                        <span className="amount-label">Intereses:</span>
                        <span className="amount-value interest">${prestamo.interestEarn}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Total a Pagar:</span>
                        <span className="amount-value">${prestamo.capitalRemaining || prestamo.prestamoAmount}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Intereses a Pagar:</span>
                        <span className="amount-value interest">${prestamo.interestToPay || prestamo.interestEarn}</span>
                      </div>
                      <div className="amount-item">
                        <span className="amount-label">Pago por Período:</span>
                        <span className="amount-value">${prestamo.amountPerPayment}</span>
                      </div>
                    </div>

                    <div className="prestamo-details">
                      <div className="detail-row">
                        <span className="detail-label">Frecuencia:</span>
                        <span className="detail-value">
                          {prestamo.paymentSchedule === 'Monthly' ? 'Mensual' : 'Quincenal'}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Número de Pagos:</span>
                        <span className="detail-value">{prestamo.amountOfPayments}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Fecha de Inicio:</span>
                        <span className="detail-value">
                          {new Date(prestamo.startDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Fecha de Fin:</span>
                        <span className="detail-value">
                          {new Date(prestamo.endDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPrestamo && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h3>Agregar Pago</h3>
              <button 
                className="modal-close-btn" 
                onClick={handlePaymentCancel}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="payment-info">
                <h4>Información del Préstamo</h4>
                <div className="payment-details-grid">
                  <div className="payment-detail">
                    <span className="detail-label">Cliente:</span>
                    <span className="detail-value">
                      {getClientInfo(selectedPrestamo.cedula).firstName} {getClientInfo(selectedPrestamo.cedula).lastName}
                    </span>
                  </div>
                  <div className="payment-detail">
                    <span className="detail-label">Monto Total del Préstamo:</span>
                    <span className="detail-value">${selectedPrestamo.prestamoAmount}</span>
                  </div>
                  <div className="payment-detail">
                    <span className="detail-label">Total a Pagar:</span>
                    <span className="detail-value">${selectedPrestamo.totalToPay}</span>
                  </div>
                  <div className="payment-detail">
                    <span className="detail-label">Intereses Totales:</span>
                    <span className="detail-value interest">${selectedPrestamo.interestEarn}</span>
                  </div>
                  <div className="payment-detail">
                    <span className="detail-label">Intereses a Pagar:</span>
                    <span className="detail-value interest">${selectedPrestamo.interestEarn}</span>
                  </div>
                  <div className="payment-detail">
                    <span className="detail-label">Pago por Período:</span>
                    <span className="detail-value">${selectedPrestamo.amountPerPayment}</span>
                  </div>
                </div>
              </div>

              <div className="payment-form">
                <h4>Detalles del Pago</h4>
                <div className="payment-inputs">
                  <div className="payment-input-group">
                    <label htmlFor="capitalPayment">Pago a Capital:</label>
                    <input
                      id="capitalPayment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentData.capitalPayment}
                      onChange={(e) => handlePaymentDataChange('capitalPayment', e.target.value)}
                      className="payment-input"
                    />
                  </div>
                  <div className="payment-input-group">
                    <label htmlFor="interestPayment">Pago a Intereses:</label>
                    <input
                      id="interestPayment"
                      type="number"
                      step="0.01"
                      min="0"
                      value={paymentData.interestPayment}
                      onChange={(e) => handlePaymentDataChange('interestPayment', e.target.value)}
                      className="payment-input"
                    />
                  </div>
                </div>
                <div className="payment-total">
                  <strong>Total del Pago: ${(paymentData.capitalPayment + paymentData.interestPayment).toFixed(2)}</strong>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="confirm-payment-btn" onClick={handlePaymentSubmit}>
                Procesar Pago
              </button>
              <button className="cancel-payment-btn" onClick={handlePaymentCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-body">
              <p>¿Está seguro que desea eliminar este préstamo?</p>
              {prestamoToDelete && (
                <div className="delete-preview">
                  <p><strong>Cliente:</strong> {getClientInfo(prestamoToDelete.cedula).firstName} {getClientInfo(prestamoToDelete.cedula).lastName}</p>
                  <p><strong>Monto:</strong> ${prestamoToDelete.prestamoAmount}</p>
                  <p><strong>Cédula:</strong> {prestamoToDelete.cedula}</p>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="confirm-delete-btn" onClick={confirmDelete}>
                Eliminar
              </button>
              <button className="cancel-delete-btn" onClick={cancelDelete}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prestamos;
