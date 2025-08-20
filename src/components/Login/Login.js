import React, { useState, useEffect } from 'react';
import './Login.css';

const Login = ({ onLogin, dark, setDark }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const loginTime = localStorage.getItem('loginTime');
    
    // Check if token exists and is still valid (optional: add expiry check)
    if (token && loginTime) {
      onLogin(true);
    }
  }, [onLogin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate a small delay for better UX
    setTimeout(() => {
      if (credentials.username === 'julioleon' && credentials.password === 'Leomaryspapi7') {
        // Generate a simple token (in a real app, this would come from the server)
        const authToken = btoa(`${credentials.username}:${Date.now()}`);
        
        // Store authentication data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('loginTime', Date.now().toString());
        localStorage.setItem('username', credentials.username);
        
        onLogin(true);
      } else {
        setError('Usuario o contraseña incorrectos');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className={`login-container ${dark ? 'dark-mode' : ''}`}>
      {/* Dark mode toggle button */}
      <button
        className="darkmode-toggle-btn"
        onClick={() => setDark(d => !d)}
        aria-label="Toggle dark mode"
      >
        {dark ? '☾ Dark' : '☀ Light'}
      </button>

      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">💳</div>
          <h1 className="login-title">Préstamos León</h1>
          <p className="login-subtitle">Sistema de Gestión de Préstamos</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Ingrese su usuario"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Ingrese su contraseña"
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            className="login-button"
            disabled={isLoading || !credentials.username || !credentials.password}
          >
            {isLoading ? (
              <>
                <div className="loading-spinner"></div>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Acceso seguro al sistema</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
