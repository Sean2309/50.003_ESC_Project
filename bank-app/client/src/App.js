import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';

// import views
import Layout from './views/Layout';
import Home from './views/Home';
import Marketplace from './views/Marketplace';

function App() {

  
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="marketplace" element={<Marketplace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;
