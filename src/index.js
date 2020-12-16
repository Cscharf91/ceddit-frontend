import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import LoadingIndicator from './components/LoadingIndicator';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <LoadingIndicator />
  </React.StrictMode>,
  document.getElementById('root')
);