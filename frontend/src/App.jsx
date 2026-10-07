import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import FarmerDashboard from './pages/FarmerDashboard';
import DiseaseDetectionPage from './pages/DiseaseDetectionPage';
import AdvisoryPage from './pages/AdvisoryPage';
import FarmerProductsPage from './pages/FarmerProductsPage';
import NewProductPage from './pages/NewProductPage';
import FarmerRequestsPage from './pages/FarmerRequestsPage';
import FarmerHistoryPage from './pages/FarmerHistoryPage';
import FarmerProfilePage from './pages/FarmerProfilePage';

import BuyerDashboard from './pages/BuyerDashboard';
import MarketplacePage from './pages/MarketplacePage';
import ProductDetailPage from './pages/ProductDetailPage';
import BuyerRequestsPage from './pages/BuyerRequestsPage';
import BuyerProfilePage from './pages/BuyerProfilePage';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
          <Navbar />

          <div className="flex-1 flex">
            <Sidebar />

            <main className="flex-1 overflow-x-hidden">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Farmer Routes */}
                <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRole="FARMER"><FarmerDashboard /></ProtectedRoute>} />
                <Route path="/farmer/disease-detection" element={<ProtectedRoute allowedRole="FARMER"><DiseaseDetectionPage /></ProtectedRoute>} />
                <Route path="/farmer/advisory" element={<ProtectedRoute allowedRole="FARMER"><AdvisoryPage /></ProtectedRoute>} />
                <Route path="/farmer/products" element={<ProtectedRoute allowedRole="FARMER"><FarmerProductsPage /></ProtectedRoute>} />
                <Route path="/farmer/products/new" element={<ProtectedRoute allowedRole="FARMER"><NewProductPage /></ProtectedRoute>} />
                <Route path="/farmer/products/:id" element={<ProtectedRoute allowedRole="FARMER"><FarmerProductsPage /></ProtectedRoute>} />
                <Route path="/farmer/requests" element={<ProtectedRoute allowedRole="FARMER"><FarmerRequestsPage /></ProtectedRoute>} />
                <Route path="/farmer/history" element={<ProtectedRoute allowedRole="FARMER"><FarmerHistoryPage /></ProtectedRoute>} />
                <Route path="/farmer/profile" element={<ProtectedRoute allowedRole="FARMER"><FarmerProfilePage /></ProtectedRoute>} />

                {/* Buyer Routes */}
                <Route path="/buyer/dashboard" element={<ProtectedRoute allowedRole="BUYER"><BuyerDashboard /></ProtectedRoute>} />
                <Route path="/buyer/marketplace" element={<ProtectedRoute allowedRole="BUYER"><MarketplacePage /></ProtectedRoute>} />
                <Route path="/buyer/products/:id" element={<ProtectedRoute allowedRole="BUYER"><ProductDetailPage /></ProtectedRoute>} />
                <Route path="/buyer/requests" element={<ProtectedRoute allowedRole="BUYER"><BuyerRequestsPage /></ProtectedRoute>} />
                <Route path="/buyer/profile" element={<ProtectedRoute allowedRole="BUYER"><BuyerProfilePage /></ProtectedRoute>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
