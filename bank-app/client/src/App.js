import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';

function App() {

  
  return (

    <BrowserRouter>
      <Routes>
        {/* Layout tab is always rendered */}
        {/* this is the bullet point direct linked text */}
        <Route path="/" element={<Layout />}>
          {/* variable rendering depending on route */}
          <Route index element={<Home />} />
          {/* <Route path="deprecatedTransferPage" element={<TransferPage />} /> */}
          <Route path="login" element={<Login />} />
          {/* <Route path="rewardCenter" element={<RewardCenter/>} /> */}
          <Route path="marketplace" element={
          <ProtectedRoute>
          <Marketplace />
          </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;