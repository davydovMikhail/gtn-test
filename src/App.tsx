import React from 'react';
import './App.css';
import Main from './pages/main';
import Mobile from './pages/mobile';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useWindowDimensions } from './hooks/useWindowDimensions'; 

function App() {
  const width = useWindowDimensions();

  return (
    <>
      { width < 1700 && 
        <Mobile/>
      }
      <Main />
      <ToastContainer/>
    </>
  );
}

export default App;
