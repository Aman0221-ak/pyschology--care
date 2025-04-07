// src/App.js
import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './components/CartContext';  
import AppRoutes from './routes'; 
import Header from './components/Header'; 
import Footer from './components/Footer';  
import './App.css'; 

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
