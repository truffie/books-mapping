import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root')!;
const root = ReactDOM.createRoot(rootElement);
root.render(
  //@ts-ignore
  <React.StrictMode>
    {/*@ts-ignore  */}
    <App />
  </React.StrictMode>
);
