// API Configuration
const API_CONFIG = {
  // Primary production backend URL (deployed on Netlify)
  PRIMARY_URL: 'https://prestamos-backend.netlify.app',
  
  // Alternate backend URL (in case the primary is down)
  ALTERNATE_URL: 'https://prestamos-backend.onrender.com',
  
  // Local development URL
  LOCAL_URL: 'http://localhost:4000',
  
  // Proxy URL (using Netlify's proxy to avoid CORS issues)
  PROXY_URL: '', // Empty string means use relative URLs - will be served from same domain
  
  // Active URL (will be set to proxy URL initially for better CORS handling)
  BASE_URL: '',  // Use relative URLs by default - helps avoid CORS issues
  
  // Method to switch to alternate URL if primary fails
  switchToAlternateUrl() {
    console.log('Switching to alternate API URL');
    this.BASE_URL = this.ALTERNATE_URL;
    return this.ALTERNATE_URL;
  },
  
  // Method to switch to local URL for development
  switchToLocalUrl() {
    console.log('Switching to local API URL');
    this.BASE_URL = this.LOCAL_URL;
    return this.LOCAL_URL;
  },
  
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
