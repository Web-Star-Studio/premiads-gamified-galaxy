
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App';
import './index.css';

// Get root element and create React root
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);

// Render app with StrictMode for additional checks during development
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
