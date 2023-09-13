import React from 'react';
import './App.css';
import Main from './pages/main';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Main/>
      <ToastContainer/>
    </>
  );
}

export default App;
