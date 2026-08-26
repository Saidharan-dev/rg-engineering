import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Scroll fade-in observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });

const observe = () => document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
observe();
new MutationObserver(observe).observe(document.body, { childList: true, subtree: true });
