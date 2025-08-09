
import React, { useState } from 'react';
import './PrestamoCards.css';

const PrestamoCards = ({ prestamos }) => {
  const [startIdx, setStartIdx] = useState(0);
  const cardsPerPage = 5;

  const handleNext = () => {
    if (startIdx + cardsPerPage < (prestamos ? prestamos.length : 0)) {
      setStartIdx(startIdx + cardsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIdx - cardsPerPage >= 0) {
      setStartIdx(startIdx - cardsPerPage);
    }
  };

  const visiblePrestamos = prestamos ? prestamos.slice(startIdx, startIdx + cardsPerPage) : [];

  return (
    <div className="prestamo-cards-container prestamos-sidebar">
      <div className="prestamo-cards-header">
        <button className="arrow-btn" onClick={handlePrev} disabled={startIdx === 0}>&lt;</button>
        <span className="prestamo-cards-title">Préstamos</span>
        <button className="arrow-btn" onClick={handleNext} disabled={!prestamos || startIdx + cardsPerPage >= prestamos.length}>&gt;</button>
      </div>
      <div className="prestamo-cards-list">
       
         {visiblePrestamos.map((prestamo, idx) => (
            <div className="prestamo-card" key={prestamo._id || idx}>
              <div className="prestamo-card-detail"><strong>Cédula:</strong> {prestamo.cedula || 'N/A'}</div>
              <div className="prestamo-card-detail"><strong>Monto:</strong> {prestamo.prestamoAmount || 'N/A'}</div>
              <div className="prestamo-card-detail"><strong>Pagos:</strong> {prestamo.amountOfPayments || 'N/A'}</div>
              <div className="prestamo-card-detail"><strong>Estado:</strong> {prestamo.status || 'Activo'}</div>
              <div className="prestamo-card-detail"><strong>Fecha inicio:</strong> {prestamo.startDate || 'N/A'}</div>
              <div className="prestamo-card-detail"><strong>Fecha fin:</strong> {prestamo.endDate || 'N/A'}</div>
            </div>
          ))
        }
        
      </div>
    </div>
  );
};

export default PrestamoCards;
