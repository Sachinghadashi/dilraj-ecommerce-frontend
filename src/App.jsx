import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import AppLayout from './layouts/AppLayout';

// Pages
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrdersHistory from './pages/OrdersHistory';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<AppLayout />}>
           <Route index element={<Home />} />
           <Route path="product/:id" element={<ProductDetail />} />
           <Route path="cart" element={<Cart />} />
           <Route path="orders" element={<OrdersHistory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
