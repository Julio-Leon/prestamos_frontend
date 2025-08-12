import React, { useState, useEffect } from 'react';
import ApiService from '../../services/ApiService';
import './ConnectionStatus.css';

const ConnectionStatus = () => {
  const [status, setStatus] = useState('checking');
  const [lastCheck, setLastCheck] = useState(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      const health = await ApiService.checkHealth();
      if (health.status === 'healthy' || health.status === 'ok') {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Connection check failed:', error);
      setStatus('disconnected');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkConnection();
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = () => {
    switch (status) {
      case 'connected':
        return {
          color: '#28a745',
          text: 'Backend Connected',
          icon: '🟢'
        };
      case 'disconnected':
        return {
          color: '#dc3545',
          text: 'Backend Disconnected',
          icon: '🔴'
        };
      case 'checking':
        return {
          color: '#ffc107',
          text: 'Checking Connection...',
          icon: '🟡'
        };
      default:
        return {
          color: '#6c757d',
          text: 'Unknown Status',
          icon: '⚪'
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="connection-status" style={{ color: statusInfo.color }}>
      <span className="status-icon">{statusInfo.icon}</span>
      <span className="status-text">{statusInfo.text}</span>
      {lastCheck && (
        <small className="last-check">
          Last check: {lastCheck.toLocaleTimeString()}
        </small>
      )}
      {status === 'disconnected' && (
        <button 
          className="retry-btn"
          onClick={checkConnection}
          title="Retry connection"
        >
          🔄
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
