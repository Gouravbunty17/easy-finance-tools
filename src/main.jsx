import React from 'react';
import { createRoot } from 'react-dom/client';
import App, { preloadRouteForPathname } from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

async function mount() {
  if (container.hasChildNodes()) {
    await preloadRouteForPathname(window.location.pathname);
  }

  createRoot(container).render(app);
}

mount();
