import React from 'react';
import ReactDOM from 'react-dom/client';

// Leaflet CSS harus diimport DI SINI
import 'leaflet/dist/leaflet.css';

// Tailwind CSS
import './index.css';

import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
