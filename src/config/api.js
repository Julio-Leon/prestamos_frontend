// API Configuration
const API_CONFIG = {
  // Production backend URL on Render
  BASE_URL: 'https://prestamos-backend.onrender.com',
  
  // API endpoints
  ENDPOINTS: {
    CLIENTS: '/clients',
    PRESTAMOS: '/prestamos',
    HEALTH: '/health'
  },
  
  // Full API URLs
  get CLIENTS_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.CLIENTS}`;
  },
  
  get PRESTAMOS_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.PRESTAMOS}`;
  },
  
  get HEALTH_URL() {
    return `${this.BASE_URL}${this.ENDPOINTS.HEALTH}`;
  },
  
  // Helper method to build URLs
  buildUrl(endpoint, id = null) {
    const baseUrl = `${this.BASE_URL}${endpoint}`;
    return id ? `${baseUrl}/${id}` : baseUrl;
  }
};

export default API_CONFIG;
