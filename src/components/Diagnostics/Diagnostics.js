import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../config/api';

const Diagnostics = () => {
  const [diagnosticResults, setDiagnosticResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results = {};

    // Test 1: Backend Health Check
    try {
      console.log('Testing health endpoint...');
      const healthResponse = await fetch(API_CONFIG.HEALTH_URL);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        results.health = { status: 'success', data: healthData };
      } else {
        results.health = { status: 'error', message: `HTTP ${healthResponse.status}` };
      }
    } catch (error) {
      results.health = { status: 'error', message: error.message };
    }

    // Test 2: Clients API
    try {
      console.log('Testing clients endpoint...');
      const clientsResponse = await fetch(API_CONFIG.CLIENTS_URL);
      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        results.clients = { status: 'success', count: clientsData.length };
      } else {
        results.clients = { status: 'error', message: `HTTP ${clientsResponse.status}` };
      }
    } catch (error) {
      results.clients = { status: 'error', message: error.message };
    }

    // Test 3: Prestamos API
    try {
      console.log('Testing prestamos endpoint...');
      const prestamosResponse = await fetch(API_CONFIG.PRESTAMOS_URL);
      if (prestamosResponse.ok) {
        const prestamosData = await prestamosResponse.json();
        results.prestamos = { status: 'success', count: prestamosData.length };
      } else {
        results.prestamos = { status: 'error', message: `HTTP ${prestamosResponse.status}` };
      }
    } catch (error) {
      results.prestamos = { status: 'error', message: error.message };
    }

    // Test 4: Browser and Environment Info
    results.environment = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      apiBaseUrl: API_CONFIG.BASE_URL,
      timestamp: new Date().toISOString()
    };

    setDiagnosticResults(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'var(--text-main)' }}>
      <h1 style={{ color: 'var(--text-main)' }}>🔍 System Diagnostics</h1>
      <p style={{ color: 'var(--text-secondary)' }}>This page helps identify connection and configuration issues.</p>
      
      <button 
        onClick={runDiagnostics} 
        disabled={isRunning}
        style={{
          background: 'var(--accent-color)',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: isRunning ? 'not-allowed' : 'pointer',
          marginBottom: '20px'
        }}
      >
        {isRunning ? '🔄 Running Tests...' : '🔄 Run Diagnostics'}
      </button>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Health Check */}
        <div style={{ 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '15px',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        }}>
          <h3 style={{ color: 'var(--text-main)' }}>{getStatusIcon(diagnosticResults.health?.status)} Backend Health Check</h3>
          <p style={{ color: 'var(--text-secondary)' }}><strong>Endpoint:</strong> {API_CONFIG.HEALTH_URL}</p>
          {diagnosticResults.health ? (
            <div>
              <p style={{ color: 'var(--text-main)' }}><strong>Status:</strong> {diagnosticResults.health.status}</p>
              {diagnosticResults.health.status === 'success' ? (
                <pre style={{ 
                  background: 'var(--bg-secondary)', 
                  color: 'var(--text-main)',
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)'
                }}>{JSON.stringify(diagnosticResults.health.data, null, 2)}</pre>
              ) : (
                <p style={{ color: 'var(--error-text)' }}>Error: {diagnosticResults.health.message}</p>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>⏳ Testing...</p>
          )}
        </div>

        {/* Clients API */}
        <div style={{ 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '15px',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        }}>
          <h3 style={{ color: 'var(--text-main)' }}>{getStatusIcon(diagnosticResults.clients?.status)} Clients API</h3>
          <p style={{ color: 'var(--text-secondary)' }}><strong>Endpoint:</strong> {API_CONFIG.CLIENTS_URL}</p>
          {diagnosticResults.clients ? (
            <div>
              <p style={{ color: 'var(--text-main)' }}><strong>Status:</strong> {diagnosticResults.clients.status}</p>
              {diagnosticResults.clients.status === 'success' ? (
                <p style={{ color: 'var(--text-main)' }}>Found {diagnosticResults.clients.count} clients</p>
              ) : (
                <p style={{ color: 'var(--error-text)' }}>Error: {diagnosticResults.clients.message}</p>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>⏳ Testing...</p>
          )}
        </div>

        {/* Prestamos API */}
        <div style={{ 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '15px',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        }}>
          <h3 style={{ color: 'var(--text-main)' }}>{getStatusIcon(diagnosticResults.prestamos?.status)} Prestamos API</h3>
          <p style={{ color: 'var(--text-secondary)' }}><strong>Endpoint:</strong> {API_CONFIG.PRESTAMOS_URL}</p>
          {diagnosticResults.prestamos ? (
            <div>
              <p style={{ color: 'var(--text-main)' }}><strong>Status:</strong> {diagnosticResults.prestamos.status}</p>
              {diagnosticResults.prestamos.status === 'success' ? (
                <p style={{ color: 'var(--text-main)' }}>Found {diagnosticResults.prestamos.count} prestamos</p>
              ) : (
                <p style={{ color: 'var(--error-text)' }}>Error: {diagnosticResults.prestamos.message}</p>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>⏳ Testing...</p>
          )}
        </div>

        {/* Environment Info */}
        <div style={{ 
          border: '1px solid var(--border-color)', 
          borderRadius: '8px', 
          padding: '15px',
          background: 'var(--bg-card)',
          color: 'var(--text-main)'
        }}>
          <h3 style={{ color: 'var(--text-main)' }}>🖥️ Environment Information</h3>
          {diagnosticResults.environment && (
            <div style={{ fontSize: '14px', color: 'var(--text-main)' }}>
              <p style={{ color: 'var(--text-main)' }}><strong>Current URL:</strong> {diagnosticResults.environment.url}</p>
              <p style={{ color: 'var(--text-main)' }}><strong>API Base URL:</strong> {diagnosticResults.environment.apiBaseUrl}</p>
              <p style={{ color: 'var(--text-main)' }}><strong>Timestamp:</strong> {diagnosticResults.environment.timestamp}</p>
              <details>
                <summary style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Browser Info</summary>
                <p style={{ 
                  fontSize: '12px', 
                  wordBreak: 'break-all',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-secondary)',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid var(--border-color)',
                  marginTop: '5px'
                }}>
                  {diagnosticResults.environment.userAgent}
                </p>
              </details>
            </div>
          )}
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        background: 'var(--bg-card)', 
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
        color: 'var(--text-main)'
      }}>
        <h4 style={{ color: 'var(--text-main)' }}>💡 Troubleshooting Tips</h4>
        <ul style={{ color: 'var(--text-main)' }}>
          <li>Make sure the backend server is deployed and accessible</li>
          <li>Check the browser console (F12) for detailed error messages</li>
          <li>Verify your network connection</li>
          <li>Try refreshing the page if tests fail</li>
        </ul>
      </div>
    </div>
  );
};

export default Diagnostics;
