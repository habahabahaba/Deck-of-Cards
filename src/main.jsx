// React:
import React from 'react';
import ReactDOM from 'react-dom/client';
// Context:
import CardsApiProvider from './Context/CardsApiProvider.jsx';
import AnimationProvider from './Context/AnimationProvider.jsx';
// Components:
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CardsApiProvider>
      <AnimationProvider>
        <App />
      </AnimationProvider>
    </CardsApiProvider>
  </React.StrictMode>
);
