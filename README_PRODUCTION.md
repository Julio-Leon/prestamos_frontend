# Prestamos Frontend - Production Configuration

This frontend is now configured to connect to the production backend deployed on Render.

## 🌐 Backend Connection

**Production Backend URL:** `https://prestamos-backend.onrender.com`

## ✅ Updated Components

All frontend components have been updated to use the production backend:

### Main App Components
- ✅ **App.js** - Main data fetching updated
- ✅ **CreateClient.js** - Client creation endpoint updated  
- ✅ **CreatePrestamo.js** - Prestamo creation and client fetching updated
- ✅ **Clients.js** - All CRUD operations updated
- ✅ **Prestamos.js** - All CRUD operations updated

### New Features Added
- ✅ **API Configuration** - Centralized API URL management (`src/config/api.js`)
- ✅ **API Service** - Centralized API calls (`src/services/ApiService.js`)
- ✅ **Connection Status** - Real-time backend connection monitoring
- ✅ **Error Handling** - Improved error messages and handling

## 🚀 Running the Frontend

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

### Build for Production
```bash
npm run build
```

## 🔧 Configuration Files

### API Configuration (`src/config/api.js`)
```javascript
const API_CONFIG = {
  BASE_URL: 'https://prestamos-backend.onrender.com',
  // ... endpoints configuration
};
```

### Environment Variables (`.env`)
```
REACT_APP_BACKEND_URL=https://prestamos-backend.onrender.com
REACT_APP_BACKEND_STRING=https://prestamos-backend.onrender.com/
```

## 📡 API Endpoints Used

### Clients
- `GET /clients` - Get all clients
- `POST /clients` - Create new client
- `GET /clients/{cedula}` - Get client by cédula
- `PUT /clients/{cedula}` - Update client
- `DELETE /clients/{cedula}` - Delete client

### Préstamos
- `GET /prestamos` - Get all préstamos
- `POST /prestamos` - Create new préstamo
- `GET /prestamos/{id}` - Get préstamo by ID
- `PUT /prestamos/{id}` - Update préstamo
- `DELETE /prestamos/{id}` - Delete préstamo

### System
- `GET /health` - Backend health check

## 🔄 Connection Status

The app now includes a real-time connection status indicator in the bottom-right corner:
- 🟢 **Connected** - Backend is responding
- 🟡 **Checking** - Testing connection
- 🔴 **Disconnected** - Backend unavailable (with retry button)

## 📱 Features

### Full CRUD Operations
- ✅ Create, Read, Update, Delete clients
- ✅ Create, Read, Update, Delete préstamos
- ✅ Real-time data updates
- ✅ Error handling with user-friendly messages

### UI/UX Improvements
- ✅ Dark/Light mode toggle
- ✅ Backend connection status
- ✅ Loading states
- ✅ Error messages
- ✅ Confirmation dialogs
- ✅ Search and filtering

## 🚨 Troubleshooting

### Backend Connection Issues
1. **Check connection status indicator**
2. **Verify backend is running:** Visit https://prestamos-backend.onrender.com
3. **Check browser console** for specific error messages
4. **CORS issues:** Backend has CORS enabled for all origins

### Common Issues
1. **Slow initial load:** Render free tier has cold starts (~30 seconds)
2. **Connection timeout:** Backend may need time to wake up
3. **Data not loading:** Check network tab in browser dev tools

### Debug Steps
```bash
# Check if backend is responding
curl https://prestamos-backend.onrender.com/health

# View frontend logs
npm start
# Then check browser console
```

## 🎯 Deployment Options

### Netlify (Recommended)
1. Build the project: `npm run build`
2. Deploy `build/` folder to Netlify
3. Set environment variables in Netlify dashboard

### Vercel
1. Connect Git repository
2. Set build command: `npm run build`
3. Set output directory: `build`

### Manual Deployment
1. Run `npm run build`
2. Upload `build/` folder to any static hosting service

## 🔐 Environment Variables

### Required for Production
```
REACT_APP_BACKEND_URL=https://prestamos-backend.onrender.com
```

### Optional
```
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

## 📊 Performance Optimizations

- ✅ Connection status caching
- ✅ API response caching
- ✅ Error boundary implementation
- ✅ Optimized re-renders
- ✅ Lazy loading considerations

## 🔄 Updates and Maintenance

### To Update Backend URL
1. Update `src/config/api.js`
2. Update `.env` file
3. Rebuild and redeploy

### To Add New API Endpoints
1. Add to `API_CONFIG` in `src/config/api.js`
2. Add methods to `ApiService.js`
3. Use in components

## 📈 Next Steps

1. **Deploy Frontend** to Netlify/Vercel
2. **Test Full CRUD** operations
3. **Monitor Performance** with connection status
4. **Add Analytics** (optional)
5. **Set up CI/CD** (optional)

## 🆘 Support

If you encounter issues:
1. Check the connection status indicator
2. Verify backend status at https://prestamos-backend.onrender.com
3. Check browser console for errors
4. Review network requests in browser dev tools

---

**✨ The frontend is now fully configured and ready for production use with your Render backend!**
