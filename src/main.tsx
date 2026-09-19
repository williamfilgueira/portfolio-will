import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Fontes self-hosted (sem depender do Google Fonts em runtime).
import '@fontsource-variable/stack-sans-notch';
import '@fontsource-variable/hanken-grotesk';
import '@fontsource-variable/jetbrains-mono';
import 'lenis/dist/lenis.css';
import './styles/index.css';

import { App } from './App';

const root = document.getElementById('root');
if (!root) throw new Error('Elemento #root não encontrado em index.html');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
