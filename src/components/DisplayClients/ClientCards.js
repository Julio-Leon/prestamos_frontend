import React, { useState } from 'react';
import './ClientCards.css';

const ClientCards = ({ clients }) => {
  const [startIdx, setStartIdx] = useState(0);
  const cardsPerPage = 5;

  const isEmpty = !clients || clients.length === 0;

  const handleNext = () => {
    if (startIdx + cardsPerPage < clients.length) {
      setStartIdx(startIdx + cardsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIdx - cardsPerPage >= 0) {
      setStartIdx(startIdx - cardsPerPage);
    }
  };

  const visibleClients = clients.slice(startIdx, startIdx + cardsPerPage);

  return (
    <div className="client-cards-container">
      <div className="client-cards-header">
        <button className="arrow-btn" onClick={handlePrev} disabled={startIdx === 0}>&lt;</button>
        <span className="client-cards-title">Clientes</span>
        <button className="arrow-btn" onClick={handleNext} disabled={startIdx + cardsPerPage >= clients.length}>&gt;</button>
      </div>
      <div className="client-cards-list">
        {visibleClients.map((client) => (
          <div className="client-card" key={client.cedula}>
            <div className="client-card-name">{client.firstName} {client.lastName}</div>
            <div className="client-card-detail"><strong>Cédula:</strong> {client.cedula}</div>
            <div className="client-card-detail"><strong>Teléfono:</strong> {client.telephoneNumber || 'N/A'}</div>
            <div className="client-card-detail"><strong>Celular:</strong> {client.celularNumber || 'N/A'}</div>
            <div className="client-card-detail"><strong>Institución:</strong> {client.department || 'N/A'}</div>
            <div className="client-card-detail"><strong>Dirección:</strong> {client.street || ''} {client.number || ''} {client.apartment ? 'Apt. ' + client.apartment : ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientCards;
