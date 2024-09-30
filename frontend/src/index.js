import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Import the main App component
import './index.css'; // Import your CSS file (optional)

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root') // Ensure your HTML file has a div with id="root"
);
