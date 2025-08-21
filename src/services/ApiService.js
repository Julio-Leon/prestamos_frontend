import API_CONFIG from '../config/api';

class ApiService {
  
  // Helper method for making API calls
  static async makeRequest(url, options = {}) {
    try {
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        mode: 'cors', // Explicitly request CORS mode
        credentials: 'same-origin', // Adjust based on your needs
      };

      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`API error (${response.status}):`, errorData);
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      // If we encounter a CORS or network error with the primary URL, try switching to the alternate URL
      if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
        console.warn('CORS or Network error detected, attempting to switch API URLs');
        if (url.includes(API_CONFIG.PRIMARY_URL)) {
          API_CONFIG.switchToAlternateUrl();
          // Retry with the new URL
          const newUrl = url.replace(API_CONFIG.PRIMARY_URL, API_CONFIG.ALTERNATE_URL);
          console.log(`Retrying with alternate URL: ${newUrl}`);
          return this.makeRequest(newUrl, options);
        }
      }
      throw error;
    }
  }

  // Client API methods
  static async getAllClients() {
    return this.makeRequest(API_CONFIG.CLIENTS_URL);
  }

  static async getClientByCedula(cedula) {
    return this.makeRequest(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CLIENTS, cedula));
  }

  static async createClient(clientData) {
    return this.makeRequest(API_CONFIG.CLIENTS_URL, {
      method: 'POST',
      body: JSON.stringify(clientData),
    });
  }

  static async updateClient(cedula, clientData) {
    return this.makeRequest(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CLIENTS, cedula), {
      method: 'PUT',
      body: JSON.stringify(clientData),
    });
  }

  static async deleteClient(cedula) {
    return this.makeRequest(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.CLIENTS, cedula), {
      method: 'DELETE',
    });
  }

  // Prestamo API methods
  static async getAllPrestamos() {
    return this.makeRequest(API_CONFIG.PRESTAMOS_URL);
  }

  static async getPrestamoById(id) {
    return this.makeRequest(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRESTAMOS, id));
  }

  static async createPrestamo(prestamoData) {
    return this.makeRequest(API_CONFIG.PRESTAMOS_URL, {
      method: 'POST',
      body: JSON.stringify(prestamoData),
    });
  }

  static async updatePrestamo(id, prestamoData) {
    return this.makeRequest(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRESTAMOS, id), {
      method: 'PUT',
      body: JSON.stringify(prestamoData),
    });
  }

  static async deletePrestamo(id) {
    return this.makeRequest(API_CONFIG.buildUrl(API_CONFIG.ENDPOINTS.PRESTAMOS, id), {
      method: 'DELETE',
    });
  }

  // Health check
  static async checkHealth() {
    try {
      return await this.makeRequest(API_CONFIG.HEALTH_URL);
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

export default ApiService;
