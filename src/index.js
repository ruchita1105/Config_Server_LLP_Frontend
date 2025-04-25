import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Import AuthProvider
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AuthProvider>  {/* Wrap your App with AuthProvider */}
      <App />
      
    </AuthProvider>
  </BrowserRouter>
);
