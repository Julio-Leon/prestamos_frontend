// API Configuration
const API_CONFIG = {
  // Production backend URL (deployed on Render)
  BASE_URL: 'https://prestamos-backend-o6cd.onrender.com',
  
  // Fallback to local backend if production is unavailable
  // BASE_URL: 'http://localhost:4000',
  
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
