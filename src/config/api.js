// API Configuration
const API_CONFIG = {
  // Temporary: Use local backend for testing CRUD operations
  // Change back to 'https://prestamos-backend.onrender.com' after redeploying to Render
  BASE_URL: 'http://localhost:4000',
  
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
